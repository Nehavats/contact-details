/**
 * Field Row Component - Individual Form Field Renderer
 * 
 * A highly reusable component that renders individual form fields based on
 * their type definition. Handles multiple field types with appropriate
 * formatting, validation, and display logic.
 * 
 * Key Features:
 * - Type-safe field rendering based on FieldDef schema
 * - Support for multiple field types (string, email, phone, radio, multi-select)
 * - Empty value detection and handling
 * - Array value processing for multi-select fields
 * - Optimized change detection with OnPush strategy
 * - Clean, accessible HTML output
 * 
 * Supported Field Types:
 * - string: Simple text display
 * - string-multiline: Multi-line text with preserved formatting
 * - email: Email with potential mailto linking
 * - phone: Phone number with potential tel linking
 * - radio: Single selection display
 * - multi-select: Multiple selections as comma-separated list
 * 
 * Component Architecture:
 * - Pure presentation component (no business logic)
 * - Receives field definition and value as inputs
 * - Renders appropriate UI based on field type
 * - Handles edge cases (null, undefined, empty arrays)
 * 
 * Usage Pattern:
 * ```html
 * <ui-field-row 
 *   [field]="fieldDefinition" 
 *   [value]="contactData[field.key]">
 * </ui-field-row>
 * ```
 * 
 * @author CRM Development Team
 * @version 1.0
 * @since 2025-10-04
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldDef } from 'src/app/models';

@Component({
  selector: 'ui-field-row',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './field-row.component.html',
  styleUrls: ['./field-row.component.scss'],
})
export class FieldRowComponent {
  
  @Input() field!: FieldDef;
  @Input() value: any;
  @Input() isEditing = false;
  @Output() valueChange = new EventEmitter<any>();
  
  // Individual field editing state
  isFieldEditing = false;
  originalValue: any;

  startFieldEdit() {
    this.isFieldEditing = true;
    this.originalValue = this.value; // Store original value for cancel
  }

  saveFieldEdit() {
    this.isFieldEditing = false;
    this.originalValue = undefined;
  }

  cancelFieldEdit() {
    this.isFieldEditing = false;
    // Revert to original value
    this.onValueChange(this.originalValue);
    this.originalValue = undefined;
  }

  onValueChange(newValue: any) {
    this.valueChange.emit(newValue);
  }

  onMultiSelectChange(option: string, checked: boolean) {
    const currentValues = this.asArray(this.value);
    let newValues: string[];
    
    if (checked) {
      newValues = [...currentValues, option];
    } else {
      newValues = currentValues.filter(v => v !== option);
    }
    
    this.valueChange.emit(newValues);
  }



  isEmpty(v: any) {
    return (
      v === undefined ||
      v === null ||
      v === '' ||
      (Array.isArray(v) && !v.length)
    );
  }

  asArray(v: any) {
    return Array.isArray(v) ? v : [];
  }


  track(i: number, v: string) {
    return v;
  }
}
