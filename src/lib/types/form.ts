export interface FieldConfig {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'textarea';
}
