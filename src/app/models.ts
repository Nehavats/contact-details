export type SectionKey = 'contactDetails' | 'conversations' | 'notes' | 'tasks';

export interface LayoutColumn {
  key: 'left' | 'middle' | 'right';
  sections: ReadonlyArray<{ key: SectionKey }>;
}

export interface PageLayout {
  columns: ReadonlyArray<LayoutColumn>;
}

export type FieldType =
  | 'string'
  | 'string-multiline'
  | 'phone'
  | 'email'
  | 'radio'
  | 'multi-select';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  hidden?: boolean;
}

export interface FolderDef {
  name: string;
  icon?: 'user' | 'info';
  fields: ReadonlyArray<FieldDef>;
}

export interface Contact {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  businessName?: string;
  streetAddress?: string;
  city?: string;
  country?: string;
  owner?: string;
  followers?: string[];
  tags?: string[];
}

export interface Conversation {
  author: string;
  time: string;
  text: string;
}

export interface Note {
  title: string;
  time: string;
  body: string;
}

export interface Task {
  text: string;
  due: string;
  done: boolean;
}
