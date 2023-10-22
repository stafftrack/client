import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useChat } from 'ai/react';
import { Button } from '@nextui-org/button';
import ChatIcon from '@/components/icons/Chat';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal';
import { Input } from '@nextui-org/input';
import SendIcon from './icons/Send';

export default function ChatRoom({
  data,
  pageType,
}: {
  data: any[];
  pageType: 'security' | 'attendance';
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/en/api/chat', // TODO: use {lang}
    body: {
      data: JSON.stringify(data),
    },
  });
  const [showPresetQuestions, setShowPresetQuestions] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const presetQuestions = {
    security: [
      // zone==AZ Department==DEPT2 Date==Last week
      '哪一天違禁品入廠的次數最多',
      '哪一種違禁品被檢出的次數最多?',
      '給我攜帶違禁品的員工編號?',
      '哪一位員工最常攜帶違禁品入廠?',
    ],
    attendance: [
      // zone==HQ Department==DEPT2 Date==Last week
      '列出每一天最早到的員工分別是誰?',
      '有多少員工遲到?給我遲到的EMPId',
      '請問哪一天最多人準時到?',
      '哪天遲到人數最多?',
    ],
  };
  const questionsForCurrentPage = presetQuestions[pageType];
  const handlePresetQuestionClick = (question: string) => {
    const fakeEvent = {
      target: {
        value: question,
        addEventListener: () => {},
        dispatchEvent: () => {},
        removeEventListener: () => {},
      } as any,
    };
    handleInputChange(fakeEvent as any);
    setShowPresetQuestions(false);
  };

  useEffect(() => {
    if (chatContainerRef.current && isOpen) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [isOpen, messages]);

  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        size="lg"
        className="absolute bottom-3 right-3 z-10 rounded-full bg-white"
      >
        <ChatIcon />
      </Button>
      <Modal
        size="3xl"
        isOpen={isOpen}
        onClose={onClose}
        backdrop="blur"
        className="bg-primary"
      >
        <ModalContent className="">
          <ModalHeader className="mx-auto text-white">AI Assitant</ModalHeader>
          <ModalBody className="text-white">
            <div
              ref={chatContainerRef}
              className="flex h-96 max-h-96 flex-col gap-5 overflow-y-scroll px-5"
            >
              <div className="w-max max-w-sm rounded-xl bg-[#2c2e3f] px-4 py-2">
                Hi, I&apos;m an AI asssistant to help you understand the data.
                How can I help you?
              </div>
              {messages.map((m) => (
                <div
                  className={`w-max max-w-sm rounded-xl bg-[#2c2e3f] px-4 py-2 ${
                    m.role === 'user' ? 'ml-auto' : ''
                  }`}
                  key={m.id}
                >
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ))}
              {showPresetQuestions && (
                <div className="mx-auto  mt-48 grid grid-cols-2 gap-4">
                  {questionsForCurrentPage.map((question) => (
                    <Button
                      key={question}
                      onClick={() => handlePresetQuestionClick(question)}
                      variant="bordered"
                      className="hover:bg-[#191a24]"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter className="flex items-center">
            <form className="flex w-full space-x-4" onSubmit={handleSubmit}>
              <Input
                variant="bordered"
                className="rounded-md text-white"
                value={input}
                onChange={handleInputChange}
                placeholder="Say something..."
              />
              <Button
                isIconOnly
                type="submit"
                onClick={() => setShowPresetQuestions(false)}
              >
                <SendIcon />
              </Button>
            </form>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
