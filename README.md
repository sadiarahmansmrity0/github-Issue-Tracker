# github-Issue-Tracker
1️⃣ **var, let, const**
- `var`: Old keyword. Scope is the whole function. Can be re-declared and updated.  
- `let`: Modern keyword. Scope is only inside the block `{ }`. Can be updated but not re-declared in the same block.  
- `const`: Block-scoped. Value cannot be changed once set (but objects/arrays can still have their contents modified).  

2️⃣ **Spread Operator (...)**
- Used to "spread" elements of an array or object.  
- Example: `const arr2 = [...arr1]` → makes a copy of `arr1`.  
- Also useful for merging arrays/objects.  

3️⃣ **map(), filter(), forEach()**
- `map()`: Goes through each item, transforms it, and returns a new array.  
- `filter()`: Goes through each item, keeps only those that match a condition, returns a new array.  
- `forEach()`: Runs code for each item, but does not return a new array.  

4️⃣ **Arrow Function**
- Shorter way to write functions.  
- Example: `const add = (a, b) => a + b;`  
- They don’t have their own `this` (useful in callbacks).  

5️⃣ **Template Literals**
- Strings written with backticks `` ` `` instead of quotes.  
- Allow embedding variables and expressions with `${ }`.  
- Example: `` `Hello, ${name}!` `` → if `name = "Sadia"`, result is `Hello, Sadia!`.  
