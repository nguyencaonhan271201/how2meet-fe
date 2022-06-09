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