import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { italianLocalizer } from '~/localizer'
import { ClientOnly } from 'remix-utils/client-only'


import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Checkbox } from '~/components/ui/checkbox'


import type { RJSFSchema, UiSchema, ArrayFieldTemplateProps, BaseInputTemplateProps, FieldTemplateProps, WidgetProps } from '@rjsf/utils'
import { Check } from 'lucide-react'

const schema2: RJSFSchema =
{
  "title": "Generated Schema",
  "type": "object",
  "required": [
    "aggiudicatario"
  ],
  "properties": {
    "aggiudicatario": {
      "type": "array",
      "title": "Aggiudicatario",
      "items": {
        "type": "object",
        "required": [
          "CIG",
          "aggiudicatario",
          "aggiudicazione_cns",
          "numero_lotto"
        ],
        "properties": {
          "CIG": {
            "type": "string",
            "title": "CIG"
          },
          "aggiudicatario": {
            "type": "string",
            "title": "Nominativo aggiudicatario. Se si tratta di CNS (consorzio nazionale servizi) completa solo con CNS."
          },
          "aggiudicazione_cns": {
            "type": "boolean",
            "title": "True se l'aggiudicatario è CNS (consorzio nazionale servizi)."
          },
          "numero_lotto": {
            "type": "string",
            "title": "numero del lotto in questione, se non presente scrivi X."
          }
        }
      }
    }
  }
}

const CustomBaseInputTemplate = (props: BaseInputTemplateProps) => {
  const {
    id,
    value,
    type,
    placeholder,
    disabled,
    readonly,
    onChange,
    autofocus: autoFocus,
    onBlur,
    onFocus,
    rawErrors,
    formContext,
    hideError,
    hideLabel,
    uiSchema,
    ...inputProps
  } = props

  // Handler per gestire i cambiamenti
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value === "" ? props.options?.emptyValue || "" : event.target.value)
  }

  // Handler per il blur
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur(id, event.target.value)
  }

  // Handler per il focus
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    onFocus(id, event.target.value)
  }

  return (
    <div className="space-y-2">
      <Input
        id={id}
        type={type || "text"}
        value={value || ""}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readonly}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={'bg-neutral-200 border-4 shadow'}
        {...inputProps}
      />

    </div>
  )
}

// Custom Field Template
const CustomFieldTemplate = (props: FieldTemplateProps) => {
  const {
    id,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    displayLabel
  } = props

  if (hidden) {
    return children
  }

  return (
    <div className="mb-4">
      {displayLabel && label && (
        <Label htmlFor={id} className={required ? "required" : ""}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      {children}
      {errors && <div className="text-sm text-red-500 mt-1">{errors}</div>}
      {help && <div className="text-sm text-gray-500 mt-1">{help}</div>}
    </div>
  )
}

const CustomCheckbox = (props: WidgetProps) => {
  const { id, value, label, onChange, required } = props

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={value || false}
        onCheckedChange={(checked) => onChange(checked)}
      />
      <Label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
    </div>
  )
}

/* const schema: RJSFSchema = {
  title: 'Todo',
  type: 'object',
  required: ['title'],
  properties: {
    title: { type: 'string', title: 'Title', default: 'A new task' },
    done: { type: 'boolean', title: 'Done?', default: false },
  },
} */


const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => (
  <div className="array-field-container">
    <div>{props.title}</div>
    {props.items.map((element) => (
      <div key={element.key} className="array-item">
        {element.children}
        {(!props.uiSchema || props.uiSchema.removable !== false) && (
          <Button
            variant={'destructive'}
            type="button"
            className="array-item-remove"
            onClick={element.onDropIndexClick(element.index)}
          >
            {props.title ? `Rimuovi ${props.title}` : "Rimuovi elemento"}
          </Button>
        )}
      </div>
    ))}
    {props.canAdd && (
      <Button
        variant={'default'}
        type="button"
        className="array-item-add"
        onClick={props.onAddClick}
      >
        {props.title ? `Aggiungi ${props.title}` : "Aggiungi elemento"}
      </Button>
    )}
  </div>
)


const SubmitButton = (props: RJSFSchema) => (
  <Button
    variant={'default'}
    type="submit"
    disabled={props.disabled}
  >
    Salva
  </Button>
)

export default function Test() {
  return (
    <ClientOnly>
      {() =>
        <>
          <Form
            schema={schema2}
            validator={validator}
            onSubmit={({ formData }) => console.log(formData)}
            transformErrors={italianLocalizer}
            formData={
              {
                "aggiudicatario": [{}]
              }
            }
            uiSchema={
              {
                "aggiudicatario": {
                  "ui:classNames": 'aggiudicatario-item-class',
                }
              }
            }
            widgets={{ CheckboxWidget: CustomCheckbox }}
            templates={
              {
                ButtonTemplates: { SubmitButton },
                ArrayFieldTemplate,
                BaseInputTemplate: CustomBaseInputTemplate,
                FieldTemplate: CustomFieldTemplate,
              }
            }
            noHtml5Validate
            showErrorList={false}
          />
        </>
      }
    </ClientOnly>
  )
}
