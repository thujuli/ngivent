import { EventController } from '@/controllers/event.controller';
import { Router } from 'express';

export class EventRouter {
private router: Router;
  private eventController: EventController;

  constructor() {
    this.router = Router();
    this.eventController = new EventController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.eventController.getEvents);
    this.router.get('/search', this.eventController.getEventsBySearch);
    this.router.get('/:id', this.eventController.getEventById);
  }

  public getRoutes(): Router {
    return this.router;
  }
}