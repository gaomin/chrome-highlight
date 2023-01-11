// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// const store = chrome.storage.local.get('test', (res) =>{
//     console.log('store', res);
// });

document.addEventListener("mouseup", (event) => {
  // console.log('mouseup', event);
  console.log(window.getSelection(), window.getSelection().getRangeAt(0));
  const txt = window.getSelection().toString();
  console.log(txt);
  if (txt) {
    // const parentNode = window.getSelection().focusNode.parentElement;
    // const html = parentNode.innerHTML.replace(txt, '<span style="color: #f00">' + txt + '</span>');
    // parentNode.innerHTML = html;
    const newParent = document.createElement("i");
    newParent.setAttribute("style", "color:#f00;");
    var range = window.getSelection().getRangeAt(0);
    range.surroundContents(newParent);

    const ele = range.commonAncestorContainer;
    const path = getElementXPath(ele);

    console.log("xpath", path);

    // chrome.storage.local.remove(['test'])
    // chrome.storage.local.set({'test': {

    // }}, function() {
    //     console.log('保存成功！');
    // });
  }
});

/*
 * Gets XPATH string representation for given DOM element, stolen from firebug_lite.
 * example: #content article section:nth-of-type(3) div p
 *
 * To keep paths short, the path generated tries to find a parent element with a unique
 * id, eg: #content article section:nth-of-type(3) div p
 */
var getElementXPath = function (element) {
  var paths = [],
    index,
    nodeName,
    tagName,
    sibling,
    pathIndex;

  for (; element && element.nodeType == 1; element = element.parentNode) {
    (index = 0), (nodeName = element.nodeName);

    if (element.id) {
      tagName = element.nodeName.toLowerCase();
      paths.splice(0, 0, '#' + element.id);
      return paths.join(" ");
    }

    for (
      sibling = element.previousSibling;
      sibling;
      sibling = sibling.previousSibling
    ) {
      if (sibling.nodeType != 1) continue;

      if (sibling.nodeName == nodeName) ++index;
    }

    tagName = element.nodeName.toLowerCase();
    pathIndex = index ? ":nth-of-type(" + (index + 1) + ")" : "";
    paths.splice(0, 0, tagName + pathIndex);
  }

  return paths.length ? " " + paths.join(" ") : null;
};

// const article = document.querySelector('article');

// `document.querySelector` may return null if the selector doesn't match anything.
// if (article) {
//     const text = article.textContent;
//     /**
//      * Regular expression to find all "words" in a string.
//      *
//      * Here, a "word" is a sequence of one or more non-whitespace characters in a row. We don't use the
//      * regular expression character class "\w" to match against "word characters" because it only
//      * matches against the Latin alphabet. Instead, we match against any sequence of characters that
//      * *are not* a whitespace characters. See the below link for more information.
//      *
//      * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
//      */
//     const wordMatchRegExp = /[^\s]+/g;
//     const words = text.matchAll(wordMatchRegExp);
//     // matchAll returns an iterator, convert to array to get word count
//     const wordCount = [...words].length;
//     const readingTime = Math.round(wordCount / 200);
//     const badge = document.createElement('p');
//     // Use the same styling as the publish information in an article's header
//     badge.classList.add('color-secondary-text', 'type--caption');
//     badge.textContent = `⏱️ ${readingTime} min read`;

//     // Support for API reference docs
//     const heading = article.querySelector('h1');
//     // Support for article docs with date
//     const date = article.querySelector('time')?.parentNode;

//     // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
//     (date ?? heading).insertAdjacentElement('afterend', badge);
// }
