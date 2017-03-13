"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var THREE = require('three');
var core_1 = require('@angular/core');
var services_1 = require('../services');
var sequence_diagram_controls_1 = require('./sequence-diagram.controls');
var _a = require('three.css')(THREE), CSS3DObject = _a.Object, CSS3DRenderer = _a.Renderer;
/*
 * Class representing 3D layer
 */
var Layer = (function (_super) {
    __extends(Layer, _super);
    function Layer(element, depth) {
        // Create CSS3DObject object
        _super.call(this, element);
        // Adjust layer position
        this.position.z = -600 * depth;
    }
    return Layer;
}(CSS3DObject));
exports.Layer = Layer;
var SequenceDiagramComponent = (function () {
    function SequenceDiagramComponent(_ngZone, service, selectableService) {
        // TODO: Toto je ukážkový kód, ako počúvať na označenie elementu.
        var _this = this;
        this._ngZone = _ngZone;
        this.service = service;
        this.selectableService = selectableService;
        this.diagramChanged = false;
        this.layerElements = [];
        this.sourceLifelineEvent = null;
        this.sourceLifelineEventModel = null;
        this.destinationLifelineEvent = null;
        this.destinationLifelineEventModel = null;
        this.layers = [];
        this.messages = [];
        this.selectableService.onLeftClick(function (event) {
            console.log("--------------------------------");
            console.info("Event typu: LeftClick");
            console.log("Klikol si na " + event.model.type + " s ID " + event.model.id);
            console.log("Súradnice tvojho kliknutia zľava: " + event.offsetX);
            console.log("Súradnice tvojho kliknutia zhora: " + event.offsetY);
            console.log("Detaily eventu: ");
            console.log(event);
            console.log("--------------------------------");
        });
        this.selectableService.onRightClick(function (event) {
            if (event.model.type === 'Lifeline') {
                _this.handleLifelineClick(event);
            }
            console.log("--------------------------------");
            console.info("Event typu: RightClick");
            console.log("Klikol si na " + event.model.type + " s ID " + event.model.id);
            console.log("Súradnice tvojho kliknutia zľava: " + event.offsetX);
            console.log("Súradnice tvojho kliknutia zhora: " + event.offsetY);
            console.log("Detaily eventu: ");
            console.log(event);
            console.log("--------------------------------");
        });
        this.selectableService.onDoubleClick(function (event) {
            console.log("--------------------------------");
            console.info("Event typu: DoubleClick");
            console.log("Klikol si na " + event.model.type + " s ID " + event.model.id);
            console.log("Súradnice tvojho kliknutia zľava: " + event.offsetX);
            console.log("Súradnice tvojho kliknutia zhora: " + event.offsetY);
            console.log("Detaily eventu: ");
            console.log(event);
            console.log("--------------------------------");
        });
        /*this.selectableService.onMouseOver((event) => {
          console.log("--------------------------------");
          console.info("Event typu: MouseOver");
          console.log("Klikol si na " + event.model.type + " s ID " + event.model.id);
          console.log("Súradnice tvojho kliknutia zľava: " + event.offsetX);
          console.log("Súradnice tvojho kliknutia zhora: " + event.offsetY);
          console.log("Detaily eventu: ");
          console.log(event);
          console.log("--------------------------------");
        });*/
        /*this.selectableService.onMouseMove((event) => {
          console.log("--------------------------------");
          console.info("Event typu: MouseMove");
          console.log("Klikol si na " + event.model.type + " s ID " + event.model.id);
          console.log("Súradnice tvojho kliknutia zľava: " + event.offsetX);
          console.log("Súradnice tvojho kliknutia zhora: " + event.offsetY);
          console.log("Detaily eventu: ");
          console.log(event);
          console.log("--------------------------------");
        });*/
    }
    SequenceDiagramComponent.prototype.handleLifelineClick = function (event) {
        var source;
        if (this.sourceLifelineEvent) {
            this.destinationLifelineEventModel = event.model;
            this.destinationLifelineEvent = event;
            console.log("Toto je lifelineKAM mam ist");
            console.log(this.destinationLifelineEvent.model.id);
            console.log("Toto je lifelineOdkial mam ist");
            console.log(this.sourceLifelineEvent.model.id);
            console.log("-------------------------------------------------------");
            console.log();
            this.createMessage(this.sourceLifelineEvent, this.sourceLifelineEventModel, this.destinationLifelineEvent, this.destinationLifelineEventModel);
            this.sourceLifelineEvent = null;
            this.destinationLifelineEvent = null;
        }
        else {
            this.sourceLifelineEvent = event;
            this.sourceLifelineEventModel = event.model;
            console.log("Toto je lifelineOdkial mam ist");
            console.log(this.sourceLifelineEvent.model.id);
        }
    };
    SequenceDiagramComponent.prototype.ngAfterViewChecked = function () {
        if (this.diagramChanged) {
            this.refreshDiagram();
            this.sourceLifelineEvent = null;
            this.destinationLifelineEvent = null;
        }
    };
    SequenceDiagramComponent.prototype.refreshDiagram = function () {
        this.diagramChanged = false;
        var layerNum = 0;
        this.sourceLifelineEvent = null;
        this.destinationLifelineEvent = null;
        // Odstránime staré vrstvy
        for (var _i = 0, _a = this.layerElements; _i < _a.length; _i++) {
            var layerElement = _a[_i];
            this.scene.remove(layerElement);
        }
        // Pridáme nové vrstvy
        for (var _b = 0, _c = this.layerComponents.toArray(); _b < _c.length; _b++) {
            var layerComponent = _c[_b];
            var element = layerComponent.element.nativeElement;
            var layer = new Layer(element, layerNum++);
            this.layerElements.push(layer);
            this.scene.add(layer);
        }
    };
    /*
     * Sleduje zmeny vstupov komponentu.
     */
    SequenceDiagramComponent.prototype.ngOnChanges = function (changes) {
        if (this.rootInteraction) {
            this.refreshRootInteraction();
            this.sourceLifelineEvent = null;
        }
    };
    // TODO: tu by mala byt implementovana funkcionalita na vytvorenie sceny
    // pri update sa len zmenia veci na scene ale nesmie sa vytvarat nova isra a pod.
    // TODO: konstanty vytiahnut von
    SequenceDiagramComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // Calculate canvas size
        var width = window.innerWidth * 0.85;
        var height = window.innerHeight;
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#fff');
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        // Create renderer
        this.renderer = new CSS3DRenderer();
        this.renderer.setSize(width, height);
        this.sceneDiv.nativeElement.appendChild(this.renderer.domElement);
        // Adjust camera position
        this.camera.position.z = 800;
        // Controls
        this.controls = new sequence_diagram_controls_1.SequenceDiagramControls(this.camera, this.renderer.domElement);
        // TODO: target by mal byt 200px za aktualnym platnom
        // this.controls.target = new THREE.Vector3(
        //     layer.position.x, layer.position.y, layer.position.z -200
        // );
        // docasna implementacia pre pracu s exampleom
        this.controls.target = new THREE.Vector3(0, 0, -200);
        // Render scene
        this._ngZone.runOutsideAngular(function () { return _this.render(); });
    };
    SequenceDiagramComponent.prototype.processExecutions = function (lifeline) {
        // TODO: konštanta - vertikálna medzera pred začiatkom a za koncom execution bloku
        var verticalPadding = 10;
        var executions = [];
        /*for (let occurrenceSpecification of lifeline.occurrenceSpecifications) {
          for (let execution of occurrenceSpecification.startingExecutionSpecifications) {
            let duration = execution.finish.time - execution.start.time;
            executions.push({
              id: execution.id,
              top: execution.start.time - verticalPadding,
              height: duration + (2 * verticalPadding)
            });
          }
        }*/
        return executions;
    };
    SequenceDiagramComponent.prototype.processLifelines = function (interaction) {
        // Inicializácia výstupného poľa
        var lifelines = [];
        // Poradové číslo lifeliny z ľavej strany
        var orderNumber = 0;
        // TODO: 1200 = layer.width
        // TODO: 120  = lifeline.width
        var lifelineModels = interaction.lifelines;
        // Medzery medzi lifelinami sa prispôsobujú podľa ich počtu
        var gap = Math.floor((1200 - 120) / (lifelineModels.length - 1)) || 0;
        for (var _i = 0, lifelineModels_1 = lifelineModels; _i < lifelineModels_1.length; _i++) {
            var lifeline = lifelineModels_1[_i];
            lifeline.leftDistance = orderNumber++ * gap;
            lifelines.push({
                id: lifeline.id,
                left: lifeline.leftDistance,
                title: lifeline.name,
                executions: this.processExecutions(lifeline)
            });
        }
        return lifelines;
    };
    SequenceDiagramComponent.prototype.resolveMessageDirection = function (message) {
        // Message smeruje z lifelineA do lifelineB
        var lifelineALeft = message.sendEvent.covered.leftDistance;
        var lifelineBLeft = message.receiveEvent.covered.leftDistance;
        return (lifelineBLeft - lifelineALeft >= 0) ? 'left-to-right' : 'right-to-left';
    };
    SequenceDiagramComponent.prototype.resolveMessageType = function (message) {
        switch (message.sort) {
            case 'asynchCall': return 'async';
            case 'synchCall': return 'sync';
            default: return 'unknown';
        }
    };
    SequenceDiagramComponent.prototype.resolveMessageLength = function (message) {
        var lifelineALeft = message.sendEvent.covered.leftDistance;
        var lifelineBLeft = message.receiveEvent.covered.leftDistance;
        // 12 = 2*6; 6 = execution.width/2
        return Math.abs(lifelineALeft - lifelineBLeft) - 12;
    };
    SequenceDiagramComponent.prototype.resolveMessagePosition = function (message) {
        var lifelineALeft = message.sendEvent.covered.leftDistance;
        var lifelineBLeft = message.receiveEvent.covered.leftDistance;
        var left = Math.min(lifelineALeft, lifelineBLeft);
        // TODO 60 je polovica zo 120, 120 je šírka lifeliny
        // 6 = execution.width/2
        // 50 = lifeline-title-height
        // 15 = message.height/2
        return {
            left: left + 60 + 6,
            top: message.sendEvent.time + 50 - 15
        };
    };
    SequenceDiagramComponent.prototype.processMessages = function (interaction) {
        var messages = [];
        var messageIdMax = 0;
        for (var _i = 0, _a = interaction.recursiveMessages; _i < _a.length; _i++) {
            var messageModel = _a[_i];
            var messagePosition = this.resolveMessagePosition(messageModel);
            messages.push({
                id: messageModel.id,
                direction: this.resolveMessageDirection(messageModel),
                type: this.resolveMessageType(messageModel),
                title: messageModel.name,
                length: this.resolveMessageLength(messageModel),
                top: messagePosition.top,
                left: messagePosition.left
            });
        }
        //tuto som chcel pushnut tu pridanu message userom...
        /* messages.push({
            id: 10,
            direction: 'left-to-right',
            type: 'unknown',
            title: "kedychcem()",
            length: 40,
            top: 15,
            left: 25
          });*/
        return messages;
    };
    SequenceDiagramComponent.prototype.envelopeFragment = function (interactionFragment) {
        // Inicializácia
        var minimalTime = null;
        var maximalTime = null;
        var mostLeft = null;
        var mostRight = null;
        // Prejdeme všetky správy v zadanom kombinovanom fragmente
        for (var _i = 0, _a = interactionFragment.recursiveMessages; _i < _a.length; _i++) {
            var message = _a[_i];
            // Určíme minimálny a maximálny čas
            if (message.sendEvent.time < minimalTime || minimalTime == null) {
                minimalTime = message.sendEvent.time;
            }
            if (message.receiveEvent.time < minimalTime || minimalTime == null) {
                minimalTime = message.receiveEvent.time;
            }
            if (message.sendEvent.time > maximalTime || maximalTime == null) {
                maximalTime = message.sendEvent.time;
            }
            if (message.receiveEvent.time > maximalTime || maximalTime == null) {
                maximalTime = message.receiveEvent.time;
            }
            // Určíme ľavú a pravú hraincu
            var lifelineALeft = message.sendEvent.covered.leftDistance;
            var lifelineBLeft = message.receiveEvent.covered.leftDistance;
            if (lifelineALeft < mostLeft || mostLeft == null) {
                mostLeft = lifelineALeft;
            }
            if (lifelineBLeft < mostLeft || mostLeft == null) {
                mostLeft = lifelineBLeft;
            }
            if (lifelineALeft > mostRight || mostRight == null) {
                mostRight = lifelineALeft;
            }
            if (lifelineBLeft > mostRight || mostRight == null) {
                mostRight = lifelineBLeft;
            }
        }
        // Kontroly
        if (minimalTime == null) {
            console.error('Could not determine minimal time for combined fragment', interactionFragment);
        }
        if (maximalTime == null) {
            console.error('Could not determine maximal time for combined fragment', interactionFragment);
        }
        if (mostLeft == null || mostRight == null) {
            console.error('Could not determine width for combined fragment', interactionFragment);
        }
        // Vytvoríme výsledný objekt
        // 50  = lifeline.title.height
        // 120 = lifeline.title.width
        var envelope = {
            minimalTime: minimalTime + 50,
            maximalTime: maximalTime + 50,
            mostLeft: mostLeft,
            mostRight: mostRight + 120
        };
        // TODO: toto je asi nepotrebné
        // Prejdeme všetky podfragmenty
        /*for (let childFragment of interactionFragment.children) {
          let childEnvelope = this.envelopeFragment(childFragment);
    
          if (childEnvelope.minimalTime < envelope.minimalTime) {
            envelope.minimalTime = childEnvelope.minimalTime;
          }
          if (childEnvelope.maximalTime > envelope.maximalTime) {
            envelope.maximalTime = childEnvelope.maximalTime;
          }
          if (childEnvelope.mostLeft < envelope.mostLeft) {
            envelope.mostLeft = childEnvelope.mostLeft;
          }
          if (childEnvelope.mostRight > envelope.mostRight) {
            envelope.mostRight = childEnvelope.mostRight;
          }
        }*/
        var fragmentPadding = 20;
        // TODO: tu to treba implementovat "inteligentne" aby vedel v akom poradi
        // idu interakcie a podfragmenty a nasledne urci ci ma davat padding zhora/zdola/oboje
        // Pozn. zlava a zprava bdue padding vzdy
        if (interactionFragment.getRecursiveFragments('CombinedFragment').length > 0) {
            // TODO: tieto dve tu nebudu vzdy, len niekedy
            envelope.minimalTime -= fragmentPadding;
            // envelope.maximalTime += fragmentPadding;
            // TODO: toto tu bdue vzdy
            envelope.mostLeft -= fragmentPadding;
            envelope.mostRight += fragmentPadding;
        }
        return envelope;
    };
    SequenceDiagramComponent.prototype.processOperands = function (combinedFragment) {
        // TODO: konštanty - vertikálna medzera pred začiatkom a za koncom execution bloku
        var topPadding = 40;
        var bottomPadding = 40;
        // Vytrovíme výsledné pole operandov
        var operands = [];
        // Prejdeme všetkých potomkov
        for (var _i = 0, _a = combinedFragment.fragment.children; _i < _a.length; _i++) {
            var childFragment = _a[_i];
            // Je potomok typu InteractionOperand ?
            if (childFragment.fragmentable.constructor.name === 'InteractionOperand') {
                var interactionOperand = childFragment.fragmentable;
                var envelope = this.envelopeFragment(childFragment);
                operands.push({
                    id: interactionOperand.id,
                    height: envelope.maximalTime - envelope.minimalTime + topPadding + bottomPadding,
                    constraint: interactionOperand.constraint
                });
            }
        }
        // TODO: Toto asi nepotrebujeme
        // Pridáme vnútorný okraj prvému operandu
        /*if (operands[0]) {
          operands[0].height += topPadding;
        }
    
        // Pridáme vnútorný okraj poslednému operandu
        let lastIndex = (operands.length - 1);
        if (operands[lastIndex]) {
          operands[lastIndex].height += bottomPadding;
        }*/
        return operands;
    };
    SequenceDiagramComponent.prototype.processFragments = function (interaction) {
        // TODO: konštanty - vertikálna medzera pred začiatkom a za koncom execution bloku
        var verticalPadding = 40; //  |
        // let horizontalPadding = 20; // ---
        // Vytrovíme výsledné pole fragmentov
        var fragments = [];
        // Prejdeme všetkých potomkov
        for (var _i = 0, _a = interaction.fragment.getRecursiveFragments('CombinedFragment'); _i < _a.length; _i++) {
            var childFragment = _a[_i];
            var combinedFragment = childFragment.fragmentable;
            var envelope = this.envelopeFragment(childFragment);
            // 60 = lifeline.title.width / 2
            // 30 = 60 / 2
            fragments.push({
                id: combinedFragment.id,
                title: combinedFragment.operator,
                width: envelope.mostRight - envelope.mostLeft - 60,
                top: envelope.minimalTime - verticalPadding,
                left: envelope.mostLeft + 30,
                operands: this.processOperands(combinedFragment)
            });
        }
        return fragments;
    };
    /* TODO:
     * tato metoda sa zovola vzdy ked sa zmeni rootInteraction
     * treba ju implementovat tak, aby vzdy prekreslila scenu
     */
    SequenceDiagramComponent.prototype.refreshRootInteraction = function () {
        // TODO: len pomocne
        console.log('The root interaction is ', this.rootInteraction);
        // Vykreslíme tri layery
        /*let lifelines = this.processLifelines(this.rootInteraction);
        let messages = this.processMessages(this.rootInteraction);
        let fragments = this.processFragments(this.rootInteraction);
    
        this.layers = [
          {
            lifelines: lifelines,
            messages: messages,
            fragments: fragments
          },
          {
            lifelines: lifelines,
            messages: messages,
            fragments: fragments
          },
          {
            lifelines: lifelines,
            messages: messages,
            fragments: fragments
          }
        ];*/
        // TODO: toto je len pomocné
        var limit = 3;
        this.layers = [];
        // Render root interaction
        // for (let i = 0; i < 3; i++)
        this.layers.push({
            id: null,
            lifelines: this.processLifelines(this.rootInteraction),
            messages: this.processMessages(this.rootInteraction),
            //messages: this.messages,
            fragments: this.processFragments(this.rootInteraction)
        });
        // TODO: pomocné
        // Render all interactions
        /*for (let interactionFragment of
          this.rootInteraction.fragment.getRecursiveFragments('Interaction')) {
          let interaction = interactionFragment.fragmentable;
          if (interaction !== this.rootInteraction) {
            if (--limit < 0) {
              break;
            }
            this.layers.push({
              id: null, // TODO: sem treba poslať ID layeru
              lifelines: this.processLifelines(interaction),
              messages: this.processMessages(interaction),
              fragments: this.processFragments(interaction)
            });
          }
        }*/
        /*let secondInteraction = this.service.getRecord(M.Interaction, '2');
        let thirdInteraction = this.service.getRecord(M.Interaction, '6');
    
        this.layers = [
          {
            lifelines: this.processLifelines(this.rootInteraction),
            messages: this.processMessages(this.rootInteraction),
            fragments: this.processFragments(this.rootInteraction)
          },
          {
            lifelines: this.processLifelines(secondInteraction),
            messages: this.processMessages(secondInteraction),
            fragments: this.processFragments(secondInteraction)
          },
          {
            lifelines: this.processLifelines(thirdInteraction),
            messages: this.processMessages(thirdInteraction),
            fragments: this.processFragments(thirdInteraction)
          }
        ];*/
        // Upravili sme pole "this.layers", diagram treba znova vyrenderovať
        this.diagramChanged = true;
    };
    // Render loop
    SequenceDiagramComponent.prototype.render = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.render(); });
        this.renderer.render(this.scene, this.camera);
    };
    SequenceDiagramComponent.prototype.createMessage = function (fromEvent, fromLifelineModel, toEvent, toLifelineModel) {
        var _this = this;
        this.service.createMessage(fromEvent, fromLifelineModel, toEvent, toLifelineModel, function (message) {
            console.log("Vytvorena message v DB");
            console.log(_this.sourceLifelineEvent);
        });
    };
    __decorate([
        core_1.ViewChild('scene')
    ], SequenceDiagramComponent.prototype, "sceneDiv");
    __decorate([
        core_1.ViewChildren('layerComponents')
    ], SequenceDiagramComponent.prototype, "layerComponents");
    __decorate([
        core_1.Input()
    ], SequenceDiagramComponent.prototype, "rootInteraction");
    SequenceDiagramComponent = __decorate([
        core_1.Component({
            selector: 'app-sequence-diagram',
            templateUrl: './sequence.diagram.component.html',
            providers: [services_1.SequenceDiagramService]
        })
    ], SequenceDiagramComponent);
    return SequenceDiagramComponent;
}());
exports.SequenceDiagramComponent = SequenceDiagramComponent;
//# sourceMappingURL=sequence.diagram.component.js.map