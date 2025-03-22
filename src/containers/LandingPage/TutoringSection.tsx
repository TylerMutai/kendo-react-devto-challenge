import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Zoom} from "@progress/kendo-react-animation";
import {Input} from "@progress/kendo-react-inputs";
import {Button} from "@progress/kendo-react-buttons";
import promptAI from "@/utils/aiService";
import removeMarkdown from "markdown-to-text";

const initialMessages = [
  {text: 'Gimme a minute as I set myself up....', isUser: false},
];

export type tutoringType = "vocabulary" | "grammar" | "pronunciation" | "fluency" | ""

export interface TutoringSectionProps {
  show: boolean,
  type: tutoringType
}

interface MessageBubbleProps {
  text: string,
  isUser: boolean
}

function TutoringSection({show, type}: TutoringSectionProps) {
  const [shouldShow, setShouldShow] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(true);
  const [messages, setMessages] = React.useState<MessageBubbleProps[]>(initialMessages);
  const [newMessage, setNewMessage] = React.useState('');
  const hasRun = useRef(false);

  const handleSend = useCallback(async () => {
    if (newMessage.trim()) {
      const _messages = [...messages, {text: newMessage.trim(), isUser: true}];
      setMessages([..._messages]);
      setLoading(true);
      const res = await promptAI(_messages.map(m => ({
        content: m.text,
        role: m.isUser ? "user" : "system",
      })));
      setMessages([..._messages, {text: removeMarkdown(res), isUser: false}]);
      setNewMessage('');
      setLoading(false);
    }
  }, [messages, newMessage]);

  useEffect(() => {
    if (type && !hasRun.current) {
      setShouldShow(Boolean(show));
      const handleInit = async () => {
        setLoading(true);
        const res = await promptAI([
          {
            content: `I'd like to learn more about: ${type}`,
            role: "user",
          },
        ]);
        setMessages([...messages, {text: res, isUser: false}]);
        setLoading(false);

      };
      handleInit().then();
    }
    hasRun.current = true;
  }, [type, show, messages]);


  const padding = "!py-[14px] !px-[18px]";

  const MessageBubble = (props: { dataItem: MessageBubbleProps }) => {
    const {text, isUser} = props.dataItem;
    return (
      <Zoom appear={true}>
        <div
          className={`p-2 rounded-lg ${isUser ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-700 text-white'} ${padding}`}>
          {text}
        </div>
      </Zoom>
    );
  };

  const messagesList = useMemo(() => (
    messages.map((m, i) => (
      <MessageBubble key={i} dataItem={m}/>
    ))
  ), [messages]);

  return (
    shouldShow ?
      <Zoom className="min-h-[100vh]" appear={true}>
        <div className="flex grow-1"/>
        <div className="w-full h-full md:w-1/3 bg-gradient-to-t from-black p-4 rounded-t-lg shadow-lg">
          <div className="h-full overflow-y-auto">
            <div className={`rounded-2xl gap-4 !flex !flex-col`}>
              {
                messagesList
              }
            </div>
          </div>
          <div className={`flex items-center mt-4 gap-6`}>
            <Input
              disabled={loading}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(`${e.target.value ? e.target.value : ""}`);
              }}
              style={{borderRadius: '20px'}}
              className={`flex-grow mr-2 bg-gray-800 text-white ${padding}`}
            />
            <Button
              disabled={loading}
              className={`${padding} !w-[150px]`}
              onClick={handleSend}
              style={{borderRadius: '20px'}}
            >
              {loading ? "Thinking...." : "Send"}
            </Button>
          </div>
        </div>
      </Zoom> : null
  );
}

export default TutoringSection;