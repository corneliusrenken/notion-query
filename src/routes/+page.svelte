<form method="POST">
  <label>
    Query
    <input name="query" type="text" />
  </label>
</form>

<style>
  :global(body) {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: min(100vh, 500px);
  }

  label {
    width: 50vw;
    display: flex;
    gap: 1rem;
  }

  input {
    flex: 1;
  }
</style>
