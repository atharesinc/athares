import React from "reactn";
import { StyleSheet, Platform, ScrollView } from "react-native";
import * as WebBrowser from "expo-web-browser";
import Markdown from "react-native-markdown-display";
import Card from "./Card";

export default function MarkdownCard({ value = "", noStyle = false }) {
  const handleLinkPress = (url) => {
    if (url) {
      if (Platform.OS === "web") {
        window.open(url, "_blank");
        return;
      }
      WebBrowser.openBrowserAsync(url);
      return false;
    }
  };

  if (noStyle) {
    return (
      <ScrollView style={styles.maxHeight}>
        <Markdown onLinkPress={handleLinkPress} style={mdStyles}>
          {value}
        </Markdown>
      </ScrollView>
    );
  }
  return (
    <Card>
      <ScrollView style={styles.maxHeight}>
        <Markdown onLinkPress={handleLinkPress} style={mdStyles}>
          {value}
        </Markdown>
      </ScrollView>
    </Card>
  );
}
const styles = StyleSheet.create({
  maxHeight: { maxHeight: 200 },
});

const mdStyles = StyleSheet.create({
  heading1: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  heading2: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  heading3: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  heading4: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  heading5: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  heading6: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  hr: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  strong: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
    fontWeight: "bold",
  },
  em: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
    fontWeight: "bold",
  },
  s: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  blockquote: {
    fontFamily: "SpaceGrotesk",
  },
  bullet_list: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  ordered_list: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  list_item: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  code_inline: {
    backgroundColor: "#282a38",
    fontFamily: "SpaceGrotesk",
    color: "#00DFFC",
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  code_block: {
    backgroundColor: "#282a38",
    fontFamily: "SpaceGrotesk",
    color: "#00DFFC",
  },
  fence: {
    backgroundColor: "#282a38",
    fontFamily: "SpaceGrotesk",
    color: "#00DFFC",
  },
  table: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
    borderColor: "#FFF",
  },
  thead: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  tbody: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  th: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  tr: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  td: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  link: {
    color: "#00DFFC",
    fontFamily: "SpaceGrotesk",
  },
  blocklink: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  image: {},
  text: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  textgroup: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  paragraph: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  hardbreak: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  softbreak: {
    color: "#FFF",
    fontFamily: "SpaceGrotesk",
  },
  pre: {
    fontFamily: "SpaceGrotesk",
  },
  inline: {
    fontFamily: "SpaceGrotesk",
  },
  span: {
    fontFamily: "SpaceGrotesk",
  },
});

// TEST STRING
// Headings

//   # h1 Heading 8-)
//   ## h2 Heading
//   ### h3 Heading
//   #### h4 Heading
//   ##### h5 Heading
//   ###### h6 Heading

// Horizontal Rules

//   Some text above
//   ___

//   Some text in the middle

//   ---

//   Some text below

// Emphasis

//   **This is bold text**

//   __This is bold text__

//   *This is italic text*

//   _This is italic text_

//   ~~Strikethrough~~

// Blockquotes

//   > Blockquotes can also be nested...
//   >> ...by using additional greater-than signs right next to each other...
//   > > > ...or with spaces between arrows.

// Lists

//   Unordered

//   + Create a list by starting a line with `+`, `-`, or `*`
//   + Sub-lists are made by indenting 2 spaces:
//     - Marker character change forces new list start:
//       * Ac tristique libero volutpat at
//       + Facilisis in pretium nisl aliquet. This is a very long list item that will surely wrap onto the next line.
//       - Nulla volutpat aliquam velit
//   + Very easy!

//   Ordered

//   1. Lorem ipsum dolor sit amet
//   2. Consectetur adipiscing elit. This is a very long list item that will surely wrap onto the next line.
//   3. Integer molestie lorem at massa

//   Start numbering with offset:

//   57. foo
//   58. bar

// Code

//   Inline `code`

//   Indented code

//       // Some comments
//       line 1 of code
//       line 2 of code
//       line 3 of code

//   Block code "fences"

//   ```
//   Sample text here...
//   ```

//   Syntax highlighting

//   ``` js
//   var foo = function (bar) {
//     return bar++;
//   };

//   console.log(foo(5));
//   ```

// Tables

//   | Option | Description |
//   | ------ | ----------- |
//   | data   | path to data files to supply the data that will be passed into templates. |
//   | engine | engine to be used for processing templates. Handlebars is the default. |
//   | ext    | extension to be used for dest files. |

//   Right aligned columns

//   | Option | Description |
//   | ------:| -----------:|
//   | data   | path to data files to supply the data that will be passed into templates. |
//   | engine | engine to be used for processing templates. Handlebars is the default. |
//   | ext    | extension to be used for dest files. |

// Links

//   [link text](https://www.google.com)

//   [link with title](https://www.google.com "title text!")

//   Autoconverted link https://www.google.com (enable linkify to see)

// Images

//   ![Minion](https://octodex.github.com/images/minion.png)
//   ![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

//   Like links, Images also have a footnote style syntax

//   ![Alt text][id]

//   With a reference later in the document defining the URL location:

//   [id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"

// Typographic Replacements

//   Enable typographer option to see result.

//   (c) (C) (r) (R) (tm) (TM) (p) (P) +-

//   test.. test... test..... test?..... test!....

//   !!!!!! ???? ,,  -- ---

//   "Smartypants, double quotes" and 'single quotes'
