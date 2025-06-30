import { Component, inject, ViewChild } from "@angular/core";
import { CategoryFormComponent } from "../../components/category/category-form/category-form.component";
import { ICategory } from "../../interfaces";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { CategoryService } from "../../services/category.service";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { CategoryListComponent } from "../../components/category/category-list/category-list.component";
import { ModalService } from "../../services/modal.service";


@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
  standalone: true,
  imports: [
    CategoryFormComponent,
    CategoryListComponent,
    PaginationComponent,
    ModalComponent
  ]
})
export class CategoriesComponent {
  public categoryList: ICategory[] = [];
  public categoryService: CategoryService = inject(CategoryService);
  public fb: FormBuilder = inject(FormBuilder);
  public categoryForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
    products: [[]]
  });

  public modalService: ModalService = inject(ModalService);
  @ViewChild('editCategoryModal') public editCategoryModal: any;

  public authService: AuthService = inject(AuthService);
  public areActionsAvailable: boolean = false;
  public route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.authService.getUserAuthorities();
    this.route.data.subscribe( data => {
      this.areActionsAvailable = this.authService.areActionsAvailable(data['authorities'] ? data['authorities'] : []);
    });
  }

  constructor() {
    this.categoryService.getAll();
  }
  

  saveCategory(item: ICategory) {
    this.categoryService.save(item);
    this.categoryForm.reset();
  }

  updateCategory(item: ICategory) {
      this.categoryService.update(item);
      this.modalService.closeAll();
      this.categoryForm.reset();
    }
  
  
    deleteCategory(item: ICategory) {
      this.categoryService.delete(item);
    }

    openEditCategoryModal(category: ICategory) {
      console.log("openEditCategoryModal", category);
      this.categoryForm.patchValue({
        id: JSON.stringify(category.id),
        name: category.name,
        description: category.description,
        products: category.products as any
      });
      this.modalService.displayModal('lg', this.editCategoryModal);
    }
}