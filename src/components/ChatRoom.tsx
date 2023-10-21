import { useEffect, useRef, useState } from 'react';
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

export default function ChatRoom({ data }: { data: any[] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: {
      data: JSON.stringify(data),
    },
  });
  const [showPresetQuestions, setShowPresetQuestions] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const presetQuestions = [
    '哪一天違禁品入廠的次數最多',
    '找出哪些員工有攜帶違禁品入廠',
    '請給我今天有攜帶違禁品的EMPId',
    '「違禁品名稱、「數量]」和「[入廠日期]」三個欄位的數據轉化為一段簡單的文字分析',
  ];
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
                  {m.content}
                </div>
              ))}
              {showPresetQuestions && (
                <div className="mx-auto  mt-48 grid grid-cols-2 gap-4">
                  {presetQuestions.map((question) => (
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
              <Button isIconOnly type="submit">
                <SendIcon />
              </Button>
            </form>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
