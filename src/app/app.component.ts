import {Component, inject, input} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {injectQuery} from "@tanstack/angular-query-experimental";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  template:`
      <!-- This doesn't fail-->
      <!-- {{ someInput() }}-->

      <!-- You get NG0950: Input is required but no value is available yet even if you remove this line-->
      <h1>{{ query.isPending() }} | {{ query.data() }}</h1>
  `
})
export class TestComponent {
  someInput = input.required<string>();

  query = injectQuery(() => ({
    queryKey: ['FANCY_KEY', this.someInput()],
    queryFn: () => Promise.resolve(this.someInput())
  }))
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [TestComponent],
  template: `
      <app-test [someInput]="'test'"/>

      <!-- That works somehow-->
      <!-- <app-test someInput="test"/>-->
  `
})
export class TestModal {
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TestComponent, TestModal],
  template: `
    <button (click)="showModal()">Open</button>
  `
})
export class AppComponent {
  modalService = inject(NgbModal);

  showModal() {
    this.modalService.open(TestModal);
  }
}

