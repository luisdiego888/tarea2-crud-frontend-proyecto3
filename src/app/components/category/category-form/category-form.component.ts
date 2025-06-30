import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ICategory } from "../../../interfaces";

@Component({
  selector: "app-category-form",
  templateUrl: "./category-form.component.html",
  styleUrls: ["./category-form.component.scss"],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
})
export class CategoryFormComponent {
    public fb: FormBuilder = inject(FormBuilder);
    @Input() form!: FormGroup;
    @Output() callSaveMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();
    @Output() callUpdateMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();

    callSave() {
        let item: ICategory = {
            name: this.form.controls["name"].value,
            description: this.form.controls["description"].value,
        }

        if(this.form.controls['id'].value) {
        item.id = this.form.controls['id'].value;
        } 
        if(item.id) {
        this.callUpdateMethod.emit(item);
        } else {
        this.callSaveMethod.emit(item);
        }
    }
}