import './style.css'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Liste des Items </h1>
    <ul id="item-list">
      <li>Chargement...</li>
    </ul>
    <p id="status-msg">Vérification du status...</p>
  </div>
`

// Appel vers l'API
// NOTE IMPORTANTE : On appelle "/api/items" et pas "http://localhost:3000/items".
// C'est le reverse-proxy Nginx qui va rediriger la requête vers le bon conteneur.
async function fetchData() {
  const listElement = document.getElementById('item-list');
  const statusElement = document.getElementById('status-msg');

  try {
    // 1. Vérification du status
    const statusRes = await fetch('/api/status');
    const statusData = await statusRes.json();
    statusElement.innerText = `Status API : ${statusData.message}`;

    // 2. Récupération des items
    const itemsRes = await fetch('/api/items');
    const items = await itemsRes.json();

    listElement.innerHTML = '';
    if (items.length === 0) {
      listElement.innerHTML = '<li>Aucun item trouvé en base.</li>';
    } else {
      items.forEach(item => {
        const li = document.createElement('li');
        
        li.textContent = JSON.stringify(item); 
        listElement.appendChild(li);
      });
    }
  } catch (error) {
    console.error(error);
    statusElement.innerText = "Erreur de connexion à l'API.";
    statusElement.style.color = "red";
    listElement.innerHTML = '';
  }
}

fetchData();