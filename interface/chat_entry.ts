import { EnumDescriptor, MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export enum HostApp {
  YouTube = 1,
  Crunchyroll = 2,
}

export let HOST_APP: EnumDescriptor<HostApp> = {
  name: 'HostApp',
  values: [
    {
      name: 'YouTube',
      value: 1,
    },
    {
      name: 'Crunchyroll',
      value: 2,
    },
  ]
}

export interface ChatEntry {
  id?: string,
  hostApp?: HostApp,
  hostContentId?: string,
  userId?: string,
  userNickname?: string,
  content?: string,
/* If absent, the chat entry is essentially a comment. */
  timestamp?: number,
/* Seconds since epoch. */
  created?: number,
}

export let CHAT_ENTRY: MessageDescriptor<ChatEntry> = {
  name: 'ChatEntry',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'id',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'hostApp',
      enumDescriptor: HOST_APP,
    },
    {
      name: 'hostContentId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'userId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'userNickname',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'content',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'timestamp',
      primitiveType: PrimitiveType.NUMBER,
    },
    {
      name: 'created',
      primitiveType: PrimitiveType.NUMBER,
    },
  ]
};
