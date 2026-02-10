class RedditClone {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('posts')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderPosts();
    }

    bindEvents() {
        document.getElementById('submitPost').addEventListener('click', () => this.addPost());
    }

    addPost() {
        const titleInput = document.getElementById('postTitle');
        const contentInput = document.getElementById('postContent');
        
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title || !content) {
            alert('Lütfen başlık ve içerik girin!');
            return;
        }

        const post = {
            id: Date.now(),
            title: title,
            content: content,
            votes: 0,
            comments: [],
            timestamp: new Date().toLocaleString('tr-TR')
        };

        this.posts.unshift(post);
        this.savePosts();
        this.renderPosts();

        titleInput.value = '';
        contentInput.value = '';
    }

    upvote(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.votes++;
            this.savePosts();
            this.renderPosts();
        }
    }

    downvote(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.votes--;
            this.savePosts();
            this.renderPosts();
        }
    }

    deletePost(postId) {
        if (confirm('Bu postu silmek istediğinizden emin misiniz?')) {
            this.posts = this.posts.filter(p => p.id !== postId);
            this.savePosts();
            this.renderPosts();
        }
    }

    renderPosts() {
        const postsList = document.getElementById('postsList');
        
        if (this.posts.length === 0) {
            postsList.innerHTML = '<p>Henüz post yok.</p>';
            return;
        }

        postsList.innerHTML = this.posts.map(post => `
            <div class="post">
                <h3>${this.escapeHtml(post.title)}</h3>
                <p>${this.escapeHtml(post.content)}</p>
                <div class="post-meta">
                    <small>${post.timestamp}</small>
                </div>
                <div class="post-actions">
                    <button class="upvote" onclick="app.upvote(${post.id})">
                        ▲ ${post.votes > 0 ? '+' : ''}${post.votes}
                    </button>
                    <button class="downvote" onclick="app.downvote(${post.id})">
                        ▼
                    </button>
                    <button onclick="app.deletePost(${post.id})">
                        Sil
                    </button>
                </div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    savePosts() {
        localStorage.setItem('posts', JSON.stringify(this.posts));
    }
}

const app = new RedditClone();
