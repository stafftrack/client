'use client';

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
import { useChat } from 'ai/react';
import { Input } from '@nextui-org/input';
import { useEffect, useRef } from 'react';
import SendIcon from './icons/Send';

export default function ChatRoom() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

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
        className="absolute bottom-5 right-5 rounded-full bg-white"
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
                Hi, how can I help you?
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
