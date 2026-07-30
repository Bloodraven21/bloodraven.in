---
title: "From Huffman to OpenObserve: Why Your 10GB Log File Fits in 3GB"
date: 2026-07-30
draft: false
tags: ["observability", "compression", "openobserve", "logs", "parquet"]
---

Every SRE has run `gzip` on a log file and watched 10GB collapse into 3GB. It feels like magic. It is not. It is a handful of very old, very simple ideas about redundancy, and once you understand them, the storage numbers behind modern observability tools stop looking like marketing and start looking like arithmetic.

Let me walk from first principles up to how a tool like OpenObserve turns those principles into a 140x cost gap.

## The naive picture, and why it is only half right

The intuition most people have is this: count how many times each character appears, store that map, and rebuild the file later from the map. That intuition is pointing at a real technique, but it mixes up two separate mechanisms. Real compressors use both. Let me split them apart.

## Mechanism one: variable length codes (Huffman)

In a plain file, every ASCII character costs a fixed 8 bits. The letter `e` costs 8 bits. The character `~` costs 8 bits. They are equally expensive even though `e` shows up constantly and `~` almost never does.

That is wasteful, and Huffman coding fixes it. The idea: assign short bit sequences to frequent characters and long bit sequences to rare ones. In a typical log stream, characters like space, `e`, `0`, `:`, and `[` appear everywhere. Huffman might give those 3 bits each. A rare character gets 12 bits. On average, across the whole file, you spend far fewer than 8 bits per character.

The "map" you were picturing is real. It is the codebook that records which bit pattern maps back to which character. Decompression reads that codebook and reverses the process, character by character, reconstructing the original file byte for byte. Nothing is lost. This is what "lossless" means: 10GB in, a byte-identical 10GB back out.

So your mental model was not wrong. It was describing Huffman. But Huffman alone is not what wins you the big ratio on logs.

## Mechanism two: dictionary compression (LZ77)

Logs are absurdly repetitive. The same timestamp prefixes, the same `INFO` and `ERROR` tags, the same request paths, the same stack frames, repeated thousands of times. Huffman does not care about repetition. It only cares about individual character frequency. So something else has to catch the repeats.

That something is dictionary compression, the LZ77 family, which is what actually powers `gzip`, `zstd`, and DEFLATE. The idea: when a sequence of bytes has appeared before, do not store it again. Store a back reference instead, a small pointer that says "go back 4000 bytes and copy the next 32 bytes."

A 200 byte log line that already appeared earlier becomes a pointer just a few bytes long. Across a repetitive log file, this is where the bulk of your savings come from.

Real compressors chain the two mechanisms. First LZ77 kills the repetition by replacing repeats with back references. Then Huffman squeezes whatever structure is left in the remaining stream. `gzip` is literally this pipeline. That combination is why logs compress far better than, say, English prose, which has much less exact repetition.

The one line summary worth remembering: **compression removes redundancy, and decompression replays the rules to rebuild the original bit for bit.** Two kinds of redundancy, two mechanisms. Repeated sequences get back references. Uneven character frequency gets variable length codes.

## Where observability tools enter the picture

Here is the leap. If compression feeds on redundancy, then the smart move is to arrange your data so that similar things sit next to each other before you compress. Adjacency of similar values is exactly the condition under which every compression algorithm performs best.

Traditional log stores write data row by row. Each log record sits as a full unit, its timestamp next to its level next to its message next to its trace ID. When you compress that, the compressor is constantly switching contexts. A timestamp, then a word, then a number, then a UUID. Redundancy is spread thin.

Now flip it.

## Columnar storage: the trick behind OpenObserve

OpenObserve does not store logs row by row. It stores them in Apache Parquet, a columnar format. Columnar means all the timestamps live together in one column, all the log levels live together in another, all the trace IDs in another, and so on.

Think about what that does to redundancy. A column of log levels is thousands of copies of `INFO`, `WARN`, and `ERROR` sitting adjacent. A column of timestamps is thousands of near identical values in sorted order. This is the densest possible feast for a compression algorithm. Parquet layers several techniques on top of this arrangement: dictionary encoding for repeated values, run length encoding for long stretches of the same value, and general compression over the result.

The payoff is real and documented. Parquet compresses typical log data at ratios around 40x, and roughly 7 to 10x compared to raw JSON specifically through column oriented encoding, dictionary compression, and run length encoding. That compression, combined with cheap S3 object storage instead of SSD backed clusters, is where the headline 140x lower storage cost versus Elasticsearch comes from.

And there is a second, quieter win. Because Elasticsearch builds an inverted index, mapping every term to every document that contains it, its storage balloons as cardinality grows. Every unique trace ID and user ID adds index entries. OpenObserve skips the inverted index entirely. The DataFusion query engine reads Parquet files directly and pulls only the columns a query actually needs, rather than scanning full records. No inverted index plus column only reads is what turns a 40x compression advantage into a 140x cost advantage.

## Why this should change how you think

The interesting thing is that OpenObserve did not invent a new compression algorithm. It made an architectural decision, columnar storage, that lets decades old compression ideas work on data arranged in the way they most want to see it. The same Huffman and LZ77 principles that shrink your `gzip` log file are doing the work. OpenObserve just serves the data to them on a silver platter.

So the next time you watch 10GB become 3GB, remember it is redundancy being removed twice over. And the next time you see a storage bill drop by two orders of magnitude on an observability migration, remember it is the same trick, applied one layer higher, at the level of how the data is laid out before compression ever runs.

Simple ideas. Arranged well. That is most of engineering.