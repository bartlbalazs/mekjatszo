import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MiniPlayer } from './components/mini-player/mini-player';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MiniPlayer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'MEKplayer';
}
