import React, { Component } from 'react';

import { EditorState } from 'draft-js';

import 'draft-js/dist/Draft.css';
import 'draft-js-emoji-plugin/lib/plugin.css';
import 'draft-js-mention-plugin/lib/plugin.css';

import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createMentionPlugin from 'draft-js-mention-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import editorStyles from './editorStyles.css';

const emojiPlugin = createEmojiPlugin();
const mentionPlugin = createMentionPlugin();
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const plugins = [emojiPlugin, mentionPlugin];
const text = `Cool, we can have all sorts of Emojis here. 🙌
🌿☃️🎉🙈 aaaand maybe a few more here 🐲☀️🗻 Quite fun!`;

const mentions = [
    {
      id:'rg5euirtg',
      name: 'Matthew Russell',
      link: 'https://twitter.com/mrussell247',
      avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
    },
    {
        id:'rgeu34irtg',
        name: 'Julian Krispel-Samsel',
      link: 'https://twitter.com/juliandoesstuff',
      avatar: 'https://avatars2.githubusercontent.com/u/1188186?v=3&s=400',
    },
    {
        id:'rgeui45rtg',
        name: 'Jyoti Puri',
      link: 'https://twitter.com/jyopur',
      avatar: 'https://avatars0.githubusercontent.com/u/2182307?v=3&s=400',
    },
    {
        id:'rg535euirtg',
        name: 'Max Stoiber',
      link: 'https://twitter.com/mxstbr',
      avatar: 'https://pbs.twimg.com/profile_images/763033229993574400/6frGyDyA_400x400.jpg',
    },
    {
        id:'rgeuerteirtg',
        name: 'Nik Graf',
      link: 'https://twitter.com/nikgraf',
      avatar: 'https://avatars0.githubusercontent.com/u/223045?v=3&s=400',
    },
    {
        id:'rgeui543rtg',
        name: 'Pascal Brandt',
      link: 'https://twitter.com/psbrandt',
      avatar: 'https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_400x400.png',
    },
  ];

export class MentionsEmojisEditor extends Component {
    constructor(props) {
        super(props);

        
    }

    state = {
        editorState: createEditorStateWithText(text),
        suggestions: mentions,
    };

    onChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    onSearchChange = ({ value }) => {
        console.log(value);
        // An import statment would break server-side rendering.
        //require('whatwg-fetch'); // eslint-disable-line global-require
    
        // while you normally would have a dynamic server that takes the value as
        // a workaround we use this workaround to show different results
        /*let url = '/data/mentionsA.json';
        if (value.length === 1) {
          url = '/data/mentionsB.json';
        } else if (value.length > 1) {
          url = '/data/mentionsC.json';
        }
    
        fetch(url)
          .then((response) => response.json())
          .then((data) => {*/
        setTimeout( _ => {
            this.setState({
                suggestions: mentions,
                });
        }, 500)
          //});
    };

    focus = () => {
        this.editor.focus();
    };

    onAddMention = (a,b,c) => {
        console.log(a,b,c)

    }

    render() {
        const { MentionSuggestions } = mentionPlugin;

        return (
            <div>
                <div className={editorStyles.editor} onClick={this.focus}>
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        plugins={plugins}
                        ref={(element) => { this.editor = element; }}
                    />
                    <MentionSuggestions
                        onSearchChange={this.onSearchChange}
                        suggestions={this.state.suggestions}
                        onAddMention={this.onAddMention}
                    />

                    <EmojiSuggestions />
                </div>
                <div className={editorStyles.options}>
                    <EmojiSelect />
                </div>
            </div>
        );
    }
}