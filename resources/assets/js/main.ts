import { Container } from 'typescript-ioc';
import { Application } from './Application';
import { DummyProvider as SequenceDiagramProvider } from './SequenceDiagram/Providers/DummyProvider';

// Create application
var app: Application = Container.get(Application);

// Compose sequence diagram
var sequenceDiagramProvider = Container.get(SequenceDiagramProvider);
app.composeSequenceDiagram(sequenceDiagramProvider);