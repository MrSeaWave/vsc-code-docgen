import * as React from 'react';
import { Component } from 'react';

/**
 * Row properties.
 */
export interface IRowProps {
  /** prop1 description */
  prop1?: string;
  /** prop2 description */
  prop2: number;
  /**
   * prop3 description
   */
  prop3: () => void;
  /** prop4 description */
  prop4: 'option1' | 'option2' | 'option3';
}

/**
 * Form Row.
 */
export class Row extends Component<IRowProps, {}> {
  render() {
    return <div>Row</div>;
  }
}

export type Options = {
  /**
   * ID ---->
   */
  id: number;
  value: string;
  cb: (name: string) => void;
};

export interface Props {
  name: '124' | '256';
  id: number;
  style: React.CSSProperties;
  options: Options;
}

export default function DefaultFn(
  props: Props & React.HTMLAttributes<HTMLDivElement>
) {
  return <div>sss:{JSON.stringify(props)}</div>;
}
