# Toast
Toast is used to display messages in an overlay.

## Import
```ts
import Toast from 'primevue/toast';
```

## Toast Service
Toast component is controlled via the ToastService that needs to be installed as an application plugin.

```ts
import {createApp} from 'vue';
import ToastService from 'primevue/toastservice';

const app = createApp(App);
app.use(ToastService);
```

The service is available with the useToast function for Composition API or using the $toast property of the application for Options API.

```ts
import { useToast } from 'primevue/usetoast';

const toast = useToast();
```

## Basic
Ideal location of a Toast is the main application template so that it can be used by any component within the application. A single message is represented by the Message interface that defines properties such as severity, summary and detail.


```ts

<template>
    <div class="card flex justify-center">
        <Toast />
        <Button label="Show" @click="show()" />
    </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();

const show = () => {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
};
</script>

```

## Severity
The severity option specifies the type of the message.


```ts

<template>
    <div class="card flex justify-center">
        <Toast />
        <div class="flex flex-wrap gap-2">
            <Button label="Success" severity="success" @click="showSuccess" />
            <Button label="Info" severity="info" @click="showInfo" />
            <Button label="Warn" severity="warn" @click="showWarn" />
            <Button label="Error" severity="danger" @click="showError" />
            <Button label="Secondary" severity="secondary" @click="showSecondary" />
            <Button label="Contrast" severity="contrast" @click="showContrast" />
        </div>
    </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();

const showSuccess = () => {
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Message Content', life: 3000 });
};

const showInfo = () => {
    toast.add({ severity: 'info', summary: 'Info Message', detail: 'Message Content', life: 3000 });
};

const showWarn = () => {
    toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Message Content', life: 3000 });
};

const showError = () => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Message Content', life: 3000 });
};

const showSecondary = () => {
    toast.add({ severity: 'secondary', summary: 'Secondary Message', detail: 'Message Content', life: 3000 });
};

const showContrast = () => {
    toast.add({ severity: 'contrast', summary: 'Contrast Message', detail: 'Message Content', life: 3000 });
};
</script>
```

## Position
A message can be targeted to a certain Toast component by matching the group keys whereas location is customized with the position.


```ts

<template>
    <div class="card flex justify-center">
        <Toast position="top-left" group="tl" />
        <Toast position="bottom-left" group="bl" />
        <Toast position="bottom-right" group="br" />

        <div class="flex flex-wrap gap-2">
            <Button label="Top Left" @click="showTopLeft" />
            <Button label="Bottom Left" @click="showBottomLeft" />
            <Button label="Bottom Right" @click="showBottomRight" />
        </div>
    </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();

const showTopLeft = () => {
    toast.add({ severity: 'info', summary: 'Info Message', detail: 'Message Content', group: 'tl', life: 3000 });
};

const showBottomLeft = () => {
    toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Message Content', group: 'bl', life: 3000 });
};

const showBottomRight = () => {
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Message Content', group: 'br', life: 3000 });
};
</script>
```

## Multiple
Multiple messages are displayed by passing an array to the show method.

```ts

<template>
    <div class="card flex justify-center">
        <Toast />
        <Button label="Multiple" @click="showMultiple()" />
    </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();

const showMultiple = () => {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Message Content', life: 3000 });
    toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3050 });
    toast.add({ severity: 'warn', summary: 'Warn', detail: 'Message Content', life: 3100 });
    toast.add({ severity: 'error', summary: 'Error', detail: 'Message Content', life: 3150 });
};
</script>
```

## Sticky
A message disappears after the number of milliseconds defined in the life option. Omit the life option to make the message sticky.


```ts

<template>
    <div class="card flex justify-center">
        <Toast />
        <div class="flex flex-wrap gap-2">
            <Button @click="showSticky" label="Sticky" />
            <Button label="Clear" severity="secondary" @click="clear()" />
        </div>
    </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();

const showSticky = () => {
    toast.add({ severity: 'info', summary: 'Sticky Message', detail: 'Message Content'});
}

const clear = () => {
    toast.removeAllGroups();
}
</script>
```

## Template
Custom content inside a message is defined with the message template.

```ts

<template>
    <div class="card flex justify-center">
        <Toast position="bottom-center" group="bc" @close="onClose">
            <template #message="slotProps">
                <div class="flex flex-col items-start flex-auto">
                    <div class="flex items-center gap-2">
                        <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
                        <span class="font-bold">Amy Elsner</span>
                    </div>
                    <div class="font-medium text-lg my-4">{{ slotProps.message.summary }}</div>
                    <Button size="small" label="Reply" severity="success" @click="onReply()"></Button>
                </div>
            </template>
        </Toast>
        <Button @click="showTemplate" label="View" />
    </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { ref } from 'vue';
const toast = useToast();
const visible = ref(false);

const showTemplate = () => {
    if (!visible.value) {
        toast.add({ severity: 'success', summary: 'Can you send me the report?', group: 'bc' });
        visible.value = true;
    } 
};

const onReply = () => {
    toast.removeGroup('bc');
    visible.value = false;
}

const onClose = () => {
    visible.value = false;
}
</script>
```

## Headless
Headless mode is enabled by defining a container slot that lets you implement entire toast UI instead of the default elements.


```ts

<template>
    <div class="card flex justify-center">
        <Toast position="top-center" group="headless" @close="visible = false">
            <template #container="{ message, closeCallback }">
                <section class="flex flex-col p-4 gap-4 w-full bg-primary/70 rounded-xl">
                    <div class="flex items-center gap-5">
                        <i class="pi pi-cloud-upload text-white dark:text-black text-2xl"></i>
                        <span class="font-bold text-base text-white dark:text-black">{{ message.summary }}</span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <ProgressBar :value="progress" :showValue="false" :style="{ height: '4px' }" pt:value:class="!bg-primary-50 dark:!bg-primary-900" class="!bg-primary/80"></ProgressBar>
                        <label class="text-sm font-bold text-white dark:text-black">{{ progress }}% uploaded</label>
                    </div>
                    <div class="flex gap-4 mb-4 justify-end">
                        <Button label="Another Upload?" size="small" @click="closeCallback"></Button>
                        <Button label="Cancel" size="small" @click="closeCallback"></Button>
                    </div>
                </section>
            </template>
        </Toast>
        <Button @click="show" label="View" />
    </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { ref, onUnmounted } from 'vue';
const toast = useToast();
const visible = ref(false);
const progress = ref(0);
const interval = ref();

onUnmounted(() => {
    if (interval.value) {
        clearInterval(interval.value);
    }
})

const show = () => {
    if (!visible.value) {
        toast.add({ severity: 'custom', summary: 'Uploading your files.', group: 'headless', styleClass: 'backdrop-blur-lg rounded-2xl' });
        visible.value = true;
        progress.value = 0;

        if (interval.value) {
            clearInterval(interval.value);
        }

        interval.value = setInterval(() => {
            if (progress.value <= 100) {
                progress.value = progress.value + 20;
            }

            if (progress.value >= 100) {
                progress.value = 100;
                clearInterval(interval.value);
            }
        }, 1000);
    }
};
</script>
```



### ✅ Toast Props

| name               | type                                                                 | default     | description                                                                 |
|--------------------|----------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| group              | string                                                               | null        | Unique identifier of a message group.                                       |
| position           | `"center" \| "top-left" \| "top-center" \| "top-right" \| "bottom-left" \| "bottom-center" \| "bottom-right"` | top-right   | Position of the toast in viewport.                                          |
| autoZIndex         | boolean                                                              | true        | Whether to automatically manage layering.                                   |
| baseZIndex         | number                                                               | 0           | Base zIndex value to use in layering.                                       |
| breakpoints        | ToastBreakpointsType                                                 | null        | Object literal to define styles per screen size.                            |
| closeIcon          | string                                                               | null        | Icon to display in the toast close button.                                  |
| infoIcon           | string                                                               | null        | Icon to display in the toast with info severity.                            |
| warnIcon           | string                                                               | null        | Icon to display in the toast with warn severity.                            |
| errorIcon          | string                                                               | null        | Icon to display in the toast with error severity.                           |
| successIcon        | string                                                               | null        | Icon to display in the toast with success severity.                         |
| closeButtonProps   | ButtonHTMLAttributes                                                 | null        | HTML props for the close button.                                            |
| message            | ToastMessageOptions                                                  | null        | Used to access message options.                                             |
| onMouseEnter       | Function                                                             | null        | Callback on `mouseenter` of the message component.                          |
| onMouseLeave       | Function                                                             | null        | Callback on `mouseleave` of the message component.                          |
| onClick            | Function                                                             | null        | Callback on `click` of the message component.                               |
| dt                 | any                                                                  | null        | Scoped CSS variables using design tokens.                                   |
| pt                 | PassThrough<ToastPassThroughOptions>                                 | null        | Pass attributes to DOM elements inside component.                           |
| ptOptions          | any                                                                  | null        | Configure passthrough options.                                              |
| unstyled           | boolean                                                              | false       | Remove component styles when enabled.                                       |

### ✅ Toast Emits

| name      | parameters       | returnType | description                                 |
|-----------|------------------|------------|---------------------------------------------|
| close     | event: ToastEvent| void       | Callback to invoke when toast is closed.    |
| life-end  | event: ToastEvent| void       | Callback when toast timeout is over.        |

### ✅ Toast Slots

| name         | parameters                                                                             | returnType                                | description                        |
|--------------|----------------------------------------------------------------------------------------|--------------------------------------------|------------------------------------|
| message      | `{ message: any }`                                                                     | `VNode[]`                                  | Custom message template            |
| icon         | `{ class: any }`                                                                       | `VNode[]`                                  | Style class of the message icon    |
| messageicon  | `{ class: any }`                                                                       | `VNode[]`                                  | Custom message icon template       |
| closeicon    | `{ class: any }`                                                                       | `VNode[]`                                  | Custom close icon template         |
| container    | `{ message: any, closeCallback: () => void }`                                          | `VNode[]`                                  | Custom container slot              |

### ✅ ToastEvent

| name    | type               | description       |
|---------|--------------------|-------------------|
| message | ToastMessageOptions| Toast message     |

### ✅ ToastMessageOptions

| name              | type                                                                 | default | description                                   |
|-------------------|----------------------------------------------------------------------|---------|-----------------------------------------------|
| severity          | HintedString<"error" \| "secondary" \| "info" \| "success" \| "warn" \| "contrast"> | info    | Severity level of the message.                |
| summary           | string                                                               | null    | Summary content of the message.               |
| detail            | any                                                                  | null    | Detail content of the message.                |
| closable          | boolean                                                              | true    | Whether it can be closed manually.            |
| life              | number                                                               | null    | Delay in ms to close automatically.           |
| group             | string                                                               | null    | Group key of the Toast to show the message.   |
| styleClass        | any                                                                  | null    | Custom style class.                           |
| contentStyleClass | any                                                                  | null    | Style class of the content.                   |

### ✅ ToastPassThroughMethodOptions

| name     | type           | default | description                     |
|----------|----------------|---------|---------------------------------|
| instance | any            | null    | Component instance.             |
| props    | ToastProps     | null    | Props passed to component.      |
| state    | ToastState     | null    | Component state.                |
| attrs    | any            | null    | HTML attributes.                |
| parent   | any            | null    | Parent context.                 |
| global   | object / null  | null    | Global passthrough options.     |

### ✅ ToastPassThroughOptions

| name            | type                           | default | description                                            |
|-----------------|--------------------------------|---------|--------------------------------------------------------|
| root            | ToastPassThroughOptionType     | null    | Attributes for root DOM element.                      |
| message         | ToastPassThroughOptionType     | null    | Attributes for message DOM element.                   |
| messageContent  | ToastPassThroughOptionType     | null    | Attributes for message content DOM element.           |
| messageIcon     | ToastPassThroughOptionType     | null    | Attributes for message icon DOM element.              |
| messageText     | ToastPassThroughOptionType     | null    | Attributes for message text DOM element.              |
| summary         | ToastPassThroughOptionType     | null    | Attributes for summary DOM element.                   |
| detail          | ToastPassThroughOptionType     | null    | Attributes for detail DOM element.                    |
| buttonContainer | ToastPassThroughOptionType     | null    | Attributes for button container DOM element.          |
| closeButton     | ToastPassThroughOptionType     | null    | Attributes for close button DOM element.              |
| closeIcon       | ToastPassThroughOptionType     | null    | Attributes for close icon DOM element.                |
| hooks           | any                            | null    | Lifecycle hook controls.                              |
| transition      | ToastPassThroughTransitionType | null    | Vue Transition API control.                           |

### ✅ ToastPassThroughAttributes

| name             | type | default | description                              |
|------------------|------|---------|------------------------------------------|
| [key: string]    | any  | null    | Arbitrary passthrough attributes.        |

### ✅ ToastBreakpointsType

| name           | type | default | description                       |
|----------------|------|---------|-----------------------------------|
| [key: string]  | any  | null    | Breakpoint definitions.           |

### ✅ ToastState

| name      | type     | default | description           |
|-----------|----------|---------|-----------------------|
| messages  | any[]    | null    | Current toast messages|

### ✅ Custom Types

#### ToastPassThroughOptionType
\`\`\`ts
ToastPassThroughAttributes
| (options: ToastPassThroughMethodOptions) => string | null | undefined
\`\`\`

#### ToastPassThroughTransitionType
\`\`\`ts
TransitionProps
| (options: ToastPassThroughMethodOptions) => TransitionProps | undefined
\`\`\`

#### ToastEmits
\`\`\`ts
EmitFn<ToastEmitsOptions>
\`\`\`

### ✅ ToastService - useToast()

| name            | parameters                        | returnType | description                                           |
|-----------------|------------------------------------|------------|-------------------------------------------------------|
| add             | message: ToastMessageOptions       | void       | Displays the message in a suitable Toast component.   |
| remove          | message: ToastMessageOptions       | void       | Removes a specific message.                           |
| removeGroup     | group: string                      | void       | Removes all messages in a specific group.             |
| removeAllGroups | -                                  | void       | Clears all toast messages.                            |
