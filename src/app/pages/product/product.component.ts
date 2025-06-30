import { Component, inject, ViewChild } from "@angular/core";
import { ProductFormComponent } from "../../components/product/product-form/product-form.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { IProduct } from "../../interfaces";
import { FormBuilder, Validators } from "@angular/forms";
import { ModalService } from "../../services/modal.service";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../../services/product.service";
import { CategoryService } from "../../services/category.service";
import { ProductListComponent } from "../../components/product/product-list/product-list.component";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
  standalone: true,
  imports: [
    ProductFormComponent,
    ProductListComponent,
    PaginationComponent,
    ModalComponent
  ]
})
export class ProductComponent {
  public productService: ProductService = inject(ProductService);
  public categoryService: CategoryService = inject(CategoryService);
  public fb: FormBuilder = inject(FormBuilder);
  public categoryList = this.categoryService.categories$;
  public productForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', Validators.required],
    stock: ['', Validators.required],
    category: ['', Validators.required],

});
  public modalService: ModalService = inject(ModalService);
  @ViewChild('editProductModal') public editProductModal: any;

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
    this.productService.getAll();
      this.categoryService.getAll();
  }
  
  saveProduct(item: IProduct) {
    this.productService.save(item);
    this.productForm.reset();
  }

  updateProduct(item: IProduct) {
    this.productService.update(item);
    this.modalService.closeAll();
  }
    
  callEdition(item: IProduct) {
    this.productForm.controls['id'].setValue(item.id ? JSON.stringify(item.id) : '');
    this.productForm.controls['name'].setValue(item.name ? item.name : '');
    this.productForm.controls['description'].setValue(item.description ? item.description : '');
    this.productForm.controls['price'].setValue(item.price ? JSON.stringify(item.price) : '');
    this.productForm.controls['stock'].setValue(item.stockQuantity ? JSON.stringify(item.stockQuantity) : '');
    this.productForm.controls['category'].setValue(item.category?.id ? JSON.stringify(item.category.id) : '');
    this.modalService.displayModal('md', this.editProductModal);
  }

  deleteProduct(item: IProduct) {
    this.productService.delete(item);
  }

  openEditProductModal() {
    this.productForm.reset();
    this.modalService.displayModal('lg', this.editProductModal);
  }
    
}
