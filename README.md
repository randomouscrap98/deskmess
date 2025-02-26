# Desk Mess

![v0.5 screenshot](screenshots/v0.5.png)

I got inspired by the non-linear, "save locally" [TiddlyWiki](https://tiddlywiki.com/)
and wanted to make something more akin to one of those pegboards filled
with images and string connecting them all. Or, a bunch of papers on a messy
desk. The person who organized it all knows where everything is, but
nobody else does.

## Features

- Create "cards" of various types anywhere you want visually
  - Text cards let you type markdown and render it
  - Chat cards let you dump thoughts as messages in a fake chatroom
  - Todo cards let you construct lists and check them off, saving the date of completion
- Set title, color, etc, resize, delete
- Ability to link cards together parent / child, build trees you can move around
- Fully local, save exact html and open it later where you left off,
  page will never update from underneath you (no server)
- Import/export raw data so you can upgrade to newer versions when desired
- Option to save/load from browser storage instead of filesystem (use `?local=name`, will use local storage + autosave)

## Goals

- If mobile support is added, perhaps different navigation modes
- Different types of things you can put in cards (drawing, etc)
- List all cards in simplified list tree view somewhere
- Add files to cards. Do we save it directly into the card though?
  blobs make everything very large in b64.
- Display all cards of a "type" and a simplified view of how you get to them.
  For things like finding all todo lists
- Grid snapping for slightly less disorganization?

