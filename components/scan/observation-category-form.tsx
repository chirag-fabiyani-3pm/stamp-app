import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface ObservationCategoryFormProps {
  categoryId: string
  value: any
  onChange: (value: any) => void
}

// Define form field options
const fieldOptions = {
  colors: ['Red', 'Blue', 'Green', 'Brown', 'Black', 'Purple', 'Orange', 'Yellow'],
  colorIntensities: ['Light', 'Medium', 'Dark', 'Very Dark'],
  paperTypes: ['Wove', 'Laid', 'Pelure', 'Granite', 'Batonne'],
  paperThicknesses: ['Thin', 'Medium', 'Thick'],
  paperTextures: ['Smooth', 'Rough', 'Ribbed', 'Mesh'],
  perforationTypes: ['Imperforate', '10', '11', '12', '13', '14', '15', 'Roulette'],
  watermarkTypes: ['None', 'Letters', 'Crown', 'Star', 'Multiple Crown', 'Multiple Star'],
  stampLocations: ['Top', 'Bottom', 'Left', 'Right', 'Center', 'Multiple'],
  conditions: ['Mint', 'Used', 'CTO', 'Damaged', 'Repaired'],
  grades: ['Poor', 'Fair', 'Good', 'Fine', 'Very Fine', 'Superb'],
};

// Add type for form field values
type FormFieldValue = string | number | Date | null;

const renderField = (type: string, props: any) => {
  switch (type) {
    case 'select':
      return (
        <Select value={props.value || ""} onValueChange={props.onChange}>
          <SelectTrigger>
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {props.options.map((option: string) => (
              <SelectItem key={option} value={option.toLowerCase()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'textarea':
      return (
        <Textarea
          value={props.value || ""}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          className="min-h-[100px]"
        />
      );

    case 'date':
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {props.value ? format(new Date(props.value), "PPP") : props.placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={props.value ? new Date(props.value) : undefined}
              onSelect={(date) => props.onChange(date?.toISOString())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );

    default: // text
      return (
        <Input
          type="text"
          value={props.value || ""}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
        />
      );
  }
};

export default function ObservationCategoryForm({ categoryId, value, onChange }: ObservationCategoryFormProps) {
  const renderFormFields = () => {
    const formFields = value || {};
    const handleChange = (field: string) => (val: FormFieldValue) => {
      onChange({ ...formFields, [field]: val });
    };

    // Get the parent category ID (remove the subcategory suffix if present)
    const parentId = categoryId.split('_')[0];
    
    switch (parentId) {
      case 'C': // Colour
        switch (categoryId) {
          case 'C_name':
            return (
              <div>
                <Label>Color Name</Label>
                {renderField('select', {
                  value: formFields.name,
                  onChange: handleChange('name'),
                  placeholder: "Select color",
                  options: fieldOptions.colors
                })}
              </div>
            );
          case 'C_shade':
            return (
              <div>
                <Label>Shade/Variation</Label>
                {renderField('text', {
                  value: formFields.shade,
                  onChange: handleChange('shade'),
                  placeholder: "Enter specific shade or variation"
                })}
              </div>
            );
          case 'C_intensity':
            return (
              <div>
                <Label>Color Intensity</Label>
                {renderField('select', {
                  value: formFields.intensity,
                  onChange: handleChange('intensity'),
                  placeholder: "Select intensity",
                  options: fieldOptions.colorIntensities
                })}
              </div>
            );
          default:
            return null;
        }

      case 'Pa': // Paper Type
        switch (categoryId) {
          case 'Pa_type':
            return (
              <div>
                <Label>Paper Type</Label>
                {renderField('select', {
                  value: formFields.type,
                  onChange: handleChange('type'),
                  placeholder: "Select paper type",
                  options: fieldOptions.paperTypes
                })}
              </div>
            );
          case 'Pa_thickness':
            return (
              <div>
                <Label>Thickness</Label>
                {renderField('select', {
                  value: formFields.thickness,
                  onChange: handleChange('thickness'),
                  placeholder: "Select thickness",
                  options: fieldOptions.paperThicknesses
                })}
              </div>
            );
          case 'Pa_texture':
            return (
              <div>
                <Label>Texture</Label>
                {renderField('select', {
                  value: formFields.texture,
                  onChange: handleChange('texture'),
                  placeholder: "Select texture",
                  options: fieldOptions.paperTextures
                })}
              </div>
            );
          default:
            return null;
        }

      case 'W': // Watermark
        switch (categoryId) {
          case 'W_type':
            return (
              <div>
                <Label>Watermark Type</Label>
                {renderField('select', {
                  value: formFields.type,
                  onChange: handleChange('type'),
                  placeholder: "Select watermark type",
                  options: fieldOptions.watermarkTypes
                })}
              </div>
            );
          case 'W_position':
            return (
              <div>
                <Label>Position</Label>
                {renderField('select', {
                  value: formFields.position,
                  onChange: handleChange('position'),
                  placeholder: "Select position",
                  options: fieldOptions.stampLocations
                })}
              </div>
            );
          case 'W_clarity':
            return (
              <div>
                <Label>Clarity</Label>
                {renderField('select', {
                  value: formFields.clarity,
                  onChange: handleChange('clarity'),
                  placeholder: "Select clarity",
                  options: ['Clear', 'Visible', 'Faint', 'Very Faint']
                })}
              </div>
            );
          default:
            return null;
        }

      case 'P': // Perforation
        switch (categoryId) {
          case 'P_type':
            return (
              <div>
                <Label>Perforation Type</Label>
                {renderField('select', {
                  value: formFields.type,
                  onChange: handleChange('type'),
                  placeholder: "Select perforation type",
                  options: fieldOptions.perforationTypes
                })}
              </div>
            );
          case 'P_measurement':
            return (
              <div>
                <Label>Measurement</Label>
                {renderField('text', {
                  value: formFields.measurement,
                  onChange: handleChange('measurement'),
                  placeholder: "Enter perforation measurement"
                })}
              </div>
            );
          case 'P_condition':
            return (
              <div>
                <Label>Condition</Label>
                {renderField('select', {
                  value: formFields.condition,
                  onChange: handleChange('condition'),
                  placeholder: "Select condition",
                  options: fieldOptions.conditions
                })}
              </div>
            );
          default:
            return null;
        }

      case 'Grd': // Grade
        return (
          <div className="space-y-4">
            <div>
              <Label>Grade Level</Label>
              {renderField('select', {
                value: formFields.level,
                onChange: handleChange('level'),
                placeholder: "Select grade level",
                options: fieldOptions.grades
              })}
            </div>
            <div>
              <Label>Condition Notes</Label>
              {renderField('textarea', {
                value: formFields.notes,
                onChange: handleChange('notes'),
                placeholder: "Enter detailed condition notes"
              })}
            </div>
          </div>
        );

      case 'PuchPrc': // Purchase Price
        return (
          <div className="space-y-4">
            <div>
              <Label>Amount</Label>
              {renderField('text', {
                value: formFields.amount,
                onChange: handleChange('amount'),
                placeholder: "Enter purchase amount"
              })}
            </div>
            <div>
              <Label>Currency</Label>
              {renderField('select', {
                value: formFields.currency,
                onChange: handleChange('currency'),
                placeholder: "Select currency",
                options: ['USD', 'EUR', 'GBP', 'AUD', 'NZD', 'CAD']
              })}
            </div>
            <div>
              <Label>Purchase Date</Label>
              {renderField('date', {
                value: formFields.date,
                onChange: handleChange('date'),
                placeholder: "Select purchase date"
              })}
            </div>
          </div>
        );

      case 'Pl': // Plating
        return (
          <div className="space-y-4">
            <div>
              <Label>Position Number</Label>
              {renderField('text', {
                value: formFields.position,
                onChange: handleChange('position'),
                placeholder: "Enter position number"
              })}
            </div>
            <div>
              <Label>Characteristics</Label>
              {renderField('textarea', {
                value: formFields.characteristics,
                onChange: handleChange('characteristics'),
                placeholder: "Enter plating characteristics"
              })}
            </div>
          </div>
        );

      case 'Can': // Cancellation
        return (
          <div className="space-y-4">
            <div>
              <Label>Cancellation Type</Label>
              {renderField('select', {
                value: formFields.type,
                onChange: handleChange('type'),
                placeholder: "Select cancellation type",
                options: ['CDS', 'Barred Numeral', 'Duplex', 'Machine', 'Manuscript']
              })}
            </div>
            <div>
              <Label>Color</Label>
              {renderField('select', {
                value: formFields.color,
                onChange: handleChange('color'),
                placeholder: "Select color",
                options: fieldOptions.colors
              })}
            </div>
            <div>
              <Label>Clarity</Label>
              {renderField('select', {
                value: formFields.clarity,
                onChange: handleChange('clarity'),
                placeholder: "Select clarity",
                options: ['Clear', 'Readable', 'Partial', 'Faint']
              })}
            </div>
          </div>
        );

      case 'Ctry': // Country
        return (
          <div className="space-y-4">
            <div>
              <Label>Country Name</Label>
              {renderField('text', {
                value: formFields.name,
                onChange: handleChange('name'),
                placeholder: "Enter country name"
              })}
            </div>
            <div>
              <Label>Region/Territory</Label>
              {renderField('text', {
                value: formFields.region,
                onChange: handleChange('region'),
                placeholder: "Enter region or territory"
              })}
            </div>
          </div>
        );

      case 'ItTyp': // Item Type
        return (
          <div>
            <Label>Item Type</Label>
            {renderField('select', {
              value: formFields.type,
              onChange: handleChange('type'),
              placeholder: "Select item type",
              options: ['single', 'pair', 'block', 'cover', 'sheet']
            })}
          </div>
        );

      case 'WdsOSt': // Words/Symbols on Stamp
        return (
          <div className="space-y-4">
            <div>
              <Label>Text Content</Label>
              {renderField('textarea', {
                value: formFields.text,
                onChange: handleChange('text'),
                placeholder: "Enter text visible on stamp"
              })}
            </div>
            <div>
              <Label>Special Markings</Label>
              {renderField('text', {
                value: formFields.markings,
                onChange: handleChange('markings'),
                placeholder: "Enter any special markings or symbols"
              })}
            </div>
          </div>
        );

      case 'DtOfIss': // Date of Issue
        return (
          <div>
            <Label>Issue Date</Label>
            {renderField('date', {
              value: formFields.date,
              onChange: handleChange('date'),
              placeholder: "Pick a date"
            })}
          </div>
        );

      // Add more cases for other categories...

      default:
        return (
          <div>
            <Label>Details</Label>
            {renderField('textarea', {
              value: formFields.details,
              onChange: handleChange('details'),
              placeholder: "Enter details"
            })}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          {renderFormFields()}
        </CardContent>
      </Card>
    </div>
  );
} 