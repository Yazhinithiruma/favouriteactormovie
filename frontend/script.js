document.getElementById('vote-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const actor = document.getElementById('actor').value;
    const movie = document.getElementById('movie').value;

    const voteData = { favoriteActor: actor, favoriteMovie: movie };

    fetch('/api/vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(voteData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('actor').value = '';
        document.getElementById('movie').value = '';
    })
    .catch(error => alert('Error: ' + error));
});

document.getElementById('history-btn').addEventListener('click', function() {
    fetch('/api/history')
    .then(response => response.json())
    .then(data => {
        const historyContainer = document.getElementById('history');
        historyContainer.innerHTML = '';

        if (data.length === 0) {
            historyContainer.innerHTML = '<p>No votes yet.</p>';
        } else {
            data.forEach((vote, index) => {
                const voteElement = document.createElement('div');
                voteElement.classList.add('vote');
                voteElement.innerHTML = `
                    <p><strong>Actor:</strong> ${vote.favoriteActor}</p>
                    <p><strong>Movie:</strong> ${vote.favoriteMovie}</p>
                    <p><strong>Votes:</strong> ${vote.count}</p>
                    <button onclick="deleteVote(${index})">Delete</button>
                `;
                historyContainer.appendChild(voteElement);
            });
        }
    });
});

function deleteVote(index) {
    fetch(`/api/history/${index}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('history-btn').click();
    });
}
