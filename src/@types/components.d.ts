interface ILoginForm {
  param1?: string;
  param2?: string;
}

interface IFooter {

}

interface IHeader {
  
}

interface IInput {
  value?: string;
  placeholder?: string;
  type?: 'password' | 'email' | 'text' | 'number';
  onChange?: ((event: React.ChangeEvent<HTMLInputElement, React.ChangeEvent>) => void) | undefined;
  required?: boolean;
  label?: string;
  error?: string;
}

interface IParticipant {
  id?: string;
  name?: string;
  profileImage?: string;
}

interface IMeetingCard {
  meetingID?: number;
  isCurrent?: boolean;
  type?: number;
  title?: string;
  time?: string;
  location?: string;
  participants?: Array<IParticipant>;
}

interface IPollingChoiceCard {
  meetingID?: number;
  choiceID?: number;
  type?: number;
  title?: string;
  link?: string;
  location?: string;
  description?: string;
  isAddCard?: boolean;
  selectors?: Array<IParticipant>;
  addAction?: () => void;
}

interface ISearchBar {
  value?: string,
  selected?: Array<any>,
  setSelected?: any
}