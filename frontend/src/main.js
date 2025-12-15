import './style.css'

document.querySelector('#app').innerHTML = `
  <main class="container">
    <nav>
      <ul>
        <li><strong>TD Docker</strong></li>
      </ul>
      <ul>
        <li><a href="#">Accueil</a></li>
        <li><a href="#" role="button" class="outline">Documentation</a></li>
      </ul>
    </nav>

    <hgroup>
      <h1>Tableau de bord</h1>
      <h2>Gestion des tâches via API Conteneurisée</h2>
    </hgroup>

    <article id="status-card">
      <header>État du système</header>
      <p id="status-msg" aria-busy="true">Vérification de la connexion à l'API...</p>
    </article>

    <article>
      <header>Liste des Tâches</header>
      <figure>
        <table role="grid">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nom de la tâche</th>
              <th scope="col">Date de création</th>
            </tr>
          </thead>
          <tbody id="item-list">
            </tbody>
        </table>
      </figure>
    </article>
  </main>
`

async function fetchData() {
  const listElement = document.getElementById('item-list');
  const statusElement = document.getElementById('status-msg');
  const statusCard = document.getElementById('status-card');

  try {
    // 1. Vérification du status
    const statusRes = await fetch('/api/status');
    const statusData = await statusRes.json();
    
    // Mise à jour de l'UI pour le status
    statusElement.setAttribute('aria-busy', 'false');
    statusElement.innerText = `✅ API Connectée : ${statusData.message}`;
    statusElement.style.color = "#2ecc71"; // Vert
    statusElement.style.fontWeight = "bold";

    // 2. Récupération des items
    const itemsRes = await fetch('/api/items');
    const items = await itemsRes.json();

    listElement.innerHTML = '';
    if (items.length === 0) {
      listElement.innerHTML = '<tr><td colspan="3">Aucun item trouvé en base.</td></tr>';
    } else {
      items.forEach(item => {
        // Formatage de la date (optionnel, pour faire propre)
        const date = new Date(item.created_at).toLocaleString();
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${date}</td>
        `;
        listElement.appendChild(tr);
      });
    }
  } catch (error) {
    console.error(error);
    statusElement.setAttribute('aria-busy', 'false');
    statusElement.innerText = "❌ Erreur : Impossible de contacter l'API.";
    statusElement.style.color = "#e74c3c"; // Rouge
    // On ajoute une classe d'erreur visuelle si besoin
  }
}

fetchData();