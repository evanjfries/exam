import {Type} from '@angular/core';
import {createCustomElement, NgElementConfig} from '@angular/elements';
import {CustomWidgetCollection, JsonObject, Question, SurveyModel} from 'survey-angular';


const SURVEY_WIDGET_METADATA = Symbol('__survey_widget_metadata__');

function dashCaseToCamelCase(input: string): string {
  return input.replace(/-+([a-z0-9])/g, (...m: any[]) => m[1].toUpperCase());
}

export interface SurveyWidgetOptions {
  /**
   * Required attribute. Unique name in lower case (use dashes to separate words).
   */
  name: string;
  /**
   * Optional attribute. Name of question type this widget is based on. (Default: 'empty')
   */
  parentName?: string;
  /**
   * Optional attribute. SurveyJS Toolbox use this value to display it as a text in toolbox item.
   * If it is empty, then name is used.
   */
  title?: string;
  /**
   * Optional attribute. If Toolbox has several categories then
   * this attribute defines to which category this custom widget belongs.
   */
  category?: string;
  /**
   * Optional attribute. Toolbox use it to show the icon type in toolbox item.
   * If it is empty, then SurveyJS Creator uses "icon-default" value.
   */
  iconName?: string;
  /**
   * SurveyJS will render this template for question input if this property is not empty.
   */
  htmlTemplate?: string;
  /**
   * Use this field if the htmlTemplate is set. MUST be other than the component selector.
   */
  selector?: string;
}

interface SurveyWidgetConfig extends SurveyWidgetOptions {
  valueName?: string;
  valueChangedName?: string;
  surveyRef?: string;
  questionRef?: string;
}

const defaultSurveyWidgetProps = {
  parentName: 'empty'
};

export type WidgetDecorator<T extends Type<any>> = (cls: T) => void;

export function SurveyWidget<T extends Type<any>>(props: SurveyWidgetOptions): WidgetDecorator<T> {
  const config = {...defaultSurveyWidgetProps, ...props};
  return (cls): void => {
    const meta = cls.hasOwnProperty(SURVEY_WIDGET_METADATA) ?
      (cls as any)[SURVEY_WIDGET_METADATA] :
      Object.defineProperty(cls as any, SURVEY_WIDGET_METADATA, {value: {}})[SURVEY_WIDGET_METADATA];
    Object.assign(meta, config);
  };
}

export function SurveyValueOutput(bindingPropertyName?: string): (target: any, propKey: string) => void {
  return (target: any, name: string): void => {
    const cls = target.constructor;
    const meta = cls.hasOwnProperty(SURVEY_WIDGET_METADATA) ?
      (cls as any)[SURVEY_WIDGET_METADATA] :
      Object.defineProperty(cls, SURVEY_WIDGET_METADATA, {value: {}})[SURVEY_WIDGET_METADATA];
    meta.valueChangedName = bindingPropertyName ?? name;
  };
}

export function SurveyValueInput(bindingPropertyName?: string): (target: any, propKey: string) => void {
  return (target: any, name: string): void => {
    const cls = target.constructor;
    const meta = cls.hasOwnProperty(SURVEY_WIDGET_METADATA) ?
      (cls as any)[SURVEY_WIDGET_METADATA] :
      Object.defineProperty(cls, SURVEY_WIDGET_METADATA, {value: {}})[SURVEY_WIDGET_METADATA];
    meta.valueName = bindingPropertyName ?? name;
  };
}

export function SurveyRef(bindingPropertyName?: string): (target: any, propKey: string) => void {
  return (target: any, name: string): void => {
    const cls = target.constructor;
    const meta = cls.hasOwnProperty(SURVEY_WIDGET_METADATA) ?
      (cls as any)[SURVEY_WIDGET_METADATA] :
      Object.defineProperty(cls, SURVEY_WIDGET_METADATA, {value: {}})[SURVEY_WIDGET_METADATA];
    meta.surveyRef = bindingPropertyName ?? name;
  };
}

export function QuestionRef(bindingPropertyName?: string): (target: any, propKey: string) => void {
  return (target: any, name: string): void => {
    const cls = target.constructor;
    const meta = cls.hasOwnProperty(SURVEY_WIDGET_METADATA) ?
      (cls as any)[SURVEY_WIDGET_METADATA] :
      Object.defineProperty(cls, SURVEY_WIDGET_METADATA, {value: {}})[SURVEY_WIDGET_METADATA];
    meta.questionRef = bindingPropertyName ?? name;
  };
}


export function bootstrapSurveyWidget(component: Type<any>, config: NgElementConfig): void {
  const widgetConfig: SurveyWidgetConfig = (component as any)[SURVEY_WIDGET_METADATA];
  if (widgetConfig == null) {
    throw Error(`Unexpected value '${component.name}'. Please add a @SurveyWidget annotation.`);
  }

  try {
    const widgetNgElementConstructor = createCustomElement(component, config);
    const widgetElementName = widgetConfig.selector ?? `surveyjs-${widgetConfig.name}`.toLowerCase();
    customElements.define(widgetElementName, widgetNgElementConstructor);

    const widgetJson = {
      name: widgetConfig.name,
      // If the widgets depends on third-party library(s) then here you may check if this library(s) is loaded
      widgetIsLoaded: () => true,
      // SurveyJS library calls this function for every question to check, if it should use this widget instead of
      // default rendering/behavior
      isFit(question: Question): boolean {
        return question.getType() === widgetConfig.name;
      },
      isDefaultRender: false,
      htmlTemplate: `<${widgetElementName}></${widgetElementName}>`,
      // Initialize widget
      activatedByChanged(activatedBy: string): void {
        JsonObject.metaData.addClass(widgetConfig.name, [], undefined, widgetConfig.parentName);
        // Add new property(s)
        // For more information go to https://surveyjs.io/Examples/Builder/?id=addproperties#content-docs
        widgetNgElementConstructor.observedAttributes
          .filter(att => att !== widgetConfig.surveyRef)
          .forEach(att => {
            const attNormalized = dashCaseToCamelCase(att);
            if (JsonObject.metaData.getProperty(widgetConfig.name, attNormalized) == null) {
              JsonObject.metaData.addProperty(widgetConfig.name, attNormalized);
            }
          });

      },
      // Main function for rendering and two-way binding
      afterRender(question: Question, htmlElement: Element): void {
        const widgetElement = htmlElement.localName === widgetElementName ? htmlElement : htmlElement.querySelector(widgetElementName);
        if (widgetElement != null) {
          const surveyRef = widgetConfig.surveyRef;
          if (surveyRef != null) {
            const survey = question.survey;
            if (isSurveyModel(survey)) {
              (widgetElement as any)[surveyRef] = survey;
            }
          }
          const questionRef = widgetConfig.questionRef;
          if (questionRef != null) {
            (widgetElement as any)[questionRef] = question;
          }
          widgetNgElementConstructor.observedAttributes
            .filter(att => att !== widgetConfig.surveyRef)
            .forEach((observedAttribute) => {
              const propertyName = dashCaseToCamelCase(observedAttribute);
              const value = question.getPropertyValue(propertyName);
              // const value = (question as any)[propertyName];
              if (value != null) {
                (widgetElement as any)[propertyName] = value;
              }
            });

          if (widgetConfig.valueChangedName != null) {
            widgetElement.addEventListener<any>(widgetConfig.valueChangedName, (event: CustomEvent) => {
              question.value = event.detail;
            });
          }

          const valueName = widgetConfig.valueName;
          if (valueName != null) {
            const updateValue = () => {
              (widgetElement as any)[valueName] = question.value;
            };
            question.valueChangedCallback = updateValue;
            // Set value from survey data if present
            updateValue();
          }
        }
      },
      //
      willUnmount(question: Question, htmlElement: Element): void {
        (question.readOnlyChangedCallback as any) = null;
        (question.valueChangedCallback as any) = null;
      }
    };

    CustomWidgetCollection.Instance.addCustomWidget(widgetJson, 'customtype');
  } catch (e) {

  }
}

export function isSurveyModel(arg: any): arg is SurveyModel {
  return arg instanceof SurveyModel;
}
