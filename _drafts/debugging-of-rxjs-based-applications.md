---
layout: debugging-of-rxjs-based-applications
title: Debugging of RxJS-Based Applications
---

## Motivation

I spent a lot of time working with [TypeScript](https://www.typescriptlang.org/), [React](https://reactjs.org/) and [RxJS](https://rxjs.dev/) professionally for the past few years. As powerful as RxJS is, I always felt kind of "lost" when I had to debug more complex source code. Built to work with imperative programming paradigms, traditional debuggers, available in IDEs or a browsers developer tools, give a very specific view on the program execution. They lack a "lens" exposing the inner workings of the reactive programming runtime environment in a suitable way. For me, debugging often boiled down to good-old trace log statements:

```typescript
userInput.pipe(
  startWith({ value: 'foobar' }),
  tap((x) => console.log(x)) // <- 😔
  flatMap(x => request(x)),
  tap((x) => console.log(x)) // <- 😔
  filter(x => x.ok)
);
```

Even though I explored more sophisticated logging utilities (e.g., [rxjs-spy](https://github.com/cartant/rxjs-spy)) over time, debugging was still a matter of interpreting a flood of trace logs in the console. I felt frustrated with the state of debugging tools available for RxJS eventually.


## Progress

I started with my studies for a master's degree in computer science back in 2019. My study advisor [Markus Stolze](https://twitter.com/markusstolze) allowed me to focus my academic research on the topic of debugging for reactive programming. The first iteration of my work on "Debugging of RxJS-Based Applications" is available now as part of the proceedings to the ["7th Workshop on Reactive and Event-based Languages & Systems"](https://2020.splashcon.org/home/rebls-2020) held at [SPLASH 2020](https://2020.splashcon.org/).

The abstract (right after), as well as the [full paper is available to download for everyone](/assets/splashws20reblsmain-p3-p-2b9e349-48142-final.pdf).

> RxJS is a popular library to implement data-flow-oriented applications with JavaScript using reactive programming principles. This way of programming bears new challenges for traditional debuggers: Their focus on imperative programming limits their applicability to problems originated in the declarative programming paradigm. The goals of this paper are: (i) to understand how software engineers debug RxJS- based applications, what tools do they use, what techniques they apply; (ii) to understand what are the most prevalent challenges they face while doing so; and (iii) to provide a course of action to resolve these challenges in a future iteration on the topic. We learned about the debugging habits of ten professionals using interviews, and hands-on war story reports. Based on this data, we designed and executed an observational study with four subjects to verify that engineers predominantly augment source code with manual trace logs instead of using specialized debugging utilities. In the end, we identified the lack of fully integrated RxJS-specific debugging solutions in existing development environments as the most significant reason why engineers do not make use of such tools. We decided to elaborate on how to resolve this situation in our future work.

## Reference Format

> Manuel Alabor and Markus Stolze. 2020. Debugging of RxJS-Based Applications. In Proceedings of the 7th ACM SIGPLAN International Workshop on Reactive and Event-Based Languages and Systems (REBLS ’20), November 16, 2020, Virtual, USA. ACM, New York, NY, USA, 10 pages. [https://doi.org/10.1145/3427763.3428313](https://doi.org/10.1145/3427763.3428313)

## Research Material

All research material (paper, observational study etc.) is publicly available on Github:

- [https://github.com/swissmanu/mse-paper-debugging-of-rxjs-based-applications](https://github.com/swissmanu/mse-paper-debugging-of-rxjs-based-applications)
- [https://github.com/swissmanu/mse-pa1-experiment](https://github.com/swissmanu/mse-pa1-experiment)
