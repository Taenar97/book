# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

*This text* is italic
_This text_ is italic

**This text** is bold
__This text__ is bold

~~This text~~ is strikethrough

<!-- horizontal Line -->
---
___

> This is a quote

[Link to Google](https://www.google.de)

* Item 1
* Item 2
* Item 3
    * Nested Item 1
    * Nested Item 2

- Another List Item
- Yet another

1. Item 1
1. Item 2
1. Item 3

`print("Inline code block")`

![Markdown Logo](https://markdown-here.com/img/icon256.png)

```bash
    npm install

    npm start
```

```javascript
    function add(num1, num2) {
        return num1+ num2;
    }
```

```python
    def add(num1, num2):
        return num1+ num2
```

| Name      | Email             |
| --------- | ----------------- |
| John Doe  | john@gmail.com    |
| Jane Doe  | jane@gmail.com    |

* [x] Task 1
* [x] Task 2
* [ ] Task 3

<!-- Math -->

This sentence uses `$` delimiters to show math inline:  $\sqrt{3x-1}+(1+x)^2$
When $a \ne 0$, there are two solutions to $(ax^2 + bx + c = 0)$ and they are 
$$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$
$$\left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)$$

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```