export interface AtomPropsDefinition {
  /**
   * export name
   */
  [key: string]: {
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
    required?: true;
  }[];
}
