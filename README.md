# Recipe App Web Service

A simple API built with Express and MySQL to add, read, update, and delete recipes.

## Routes
<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Endpoint</th>
      <th>Parameters / Body</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>GET</td>
      <td>/allrecipes</td>
      <td>–</td>
      <td>Get all recipes</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/addrecipe</td>
      <td>Body: { recipe_name, cuisine, prep_time }</td>
      <td>Add a new recipe</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/editrecipe/:id</td>
      <td>Params: { id }, Body: { recipe_name, cuisine, prep_time }</td>
      <td>Update a recipe by ID</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/deleterecipe/:id</td>
      <td>Params: { id }</td>
      <td>Delete a recipe by ID</td>
    </tr>
  </tbody>
</table>

