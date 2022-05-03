import React, { useCallback, RefObject, forwardRef } from 'react';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IDM, IChat } from '@typings/db';
import Chat from '@components/Chat';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  scrollbarRef: RefObject<Scrollbars>;
  chatSections: { [key: string]: IDM[] };
  setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(
  ({ scrollbarRef, chatSections, setSize, isEmpty, isReachingEnd }, ref) => {
    const onScroll = useCallback(
      (values) => {
        if (values.scrollTop === 0 && !isReachingEnd && !isEmpty) {
          setSize((size) => size + 1).then(() => {
            scrollbarRef.current?.scrollTop(scrollbarRef.current?.getScrollHeight() - values.scrollHeight);
          });
        }
      },
      [setSize, scrollbarRef, isReachingEnd, isEmpty],
    );

    return (
      <ChatZone>
        <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
          {Object.entries(chatSections).map(([date, chats]) => {
            return (
              <Section className={`section-${date}`} key={date}>
                <StickyHeader>
                  <button>{date}</button>
                </StickyHeader>
                {chats.map((chat) => (
                  <Chat key={chat.id} data={chat} />
                ))}
              </Section>
            );
          })}
        </Scrollbars>
      </ChatZone>
    );
  },
);

export default ChatList;
