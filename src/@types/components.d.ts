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
  readonly?: boolean;
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
  participants?: Array<ICreateUserResponse>;
  isHost?: boolean;
  getDates?: Array<any>;
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
  selectors?: Array<ICreateUserResponse>;
  addAction?: () => void;
  editAction?: (number) => void;
}

interface IPollingChoiceSelectableCard extends IPollingChoiceCard {
  isSelected?: boolean;
  setSelected?: () => void;
  isSelectable?: boolean;
  isEditable?: boolean;
  editableMeeting?: boolean;
}

interface ISearchBar {
  value?: string,
  selected?: Array<ICreateUserResponse>,
  setSelected?: any,
  editable?: boolean
}

interface IMeetingMinuteCard {
  meetingID?: number;
  minuteID?: number;
  creator?: ICreateUserResponse;
  created?: string;
  lastUpdated?: string;
  title?: string;
  description?: string;
  isAddCard?: boolean;
  addAction?: () => void;
}