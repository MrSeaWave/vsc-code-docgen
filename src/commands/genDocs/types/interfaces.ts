// type LocaleDescKey = `description${string}`;

export interface AtomPropsDefinition {
  /**
   * component property name
   */
  identifier: string;
  /**
   * component property label
   */
  name?: string;
  /**
   * component property description
   */
  description?: string;
  /**
   * component property type
   */
  type: string;
  /**
   * component property default value
   */
  default?: string;
  /**
   * property whether required
   */
  required?: Boolean;
}

export type ApiDefinition = {
  exportName: string;
  attrs: AtomPropsDefinition[];
};
