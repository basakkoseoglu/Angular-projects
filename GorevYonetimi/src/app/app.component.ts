import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, TaskListComponent,HttpClientModule],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Görev Yönetim Uygulaması';
}
