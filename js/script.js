document.addEventListener('DOMContentLoaded', function() {
    // Data Produk (Contoh, Anda bisa menambah atau mengubah ini)
    const products = [
        {
            id: 1,
            name: 'Jaket Denim LOUDWELL "Rebel Soul"',
            price: 'Rp 399.000',
            description: 'Jaket denim premium dengan detail jahitan yang unik dan patch "Rebel Soul". Cocok untuk tampilan kasual yang berani.',
            availability: 'Tersedia',
            material: 'Denim Katun Tebal',
            sizes: 'S, M, L, XL',
            image: 'img/product1.jpg',
            detailImages: [
                'img/product1_detail1.jpg',
                'img/product1_detail2.jpg',
                'https://via.placeholder.com/800x600?text=Jaket+Denim+Detail+3',
                'https://via.placeholder.com/800x600?text=Jaket+Denim+Detail+4'
            ],
            shopeeLink: 'https://shopee.co.id/jaket-denim-loudwell-rebel-soul-i.123456789.987654321'
        },
        {
            id: 2,
            name: 'Kaos Oversize "Urban Explorer"',
            price: 'Rp 149.000',
            description: 'Kaos oversize nyaman dengan desain grafis "Urban Explorer" yang minimalis namun penuh gaya. Ideal untuk keseharian Anda.',
            availability: 'Tersedia',
            material: 'Katun Combed 30s',
            sizes: 'M, L, XL, XXL',
            image: 'img/product2.jpg',
            detailImages: [
                'img/product2_detail1.jpg',
                'img/product2_detail2.jpg',
                'https://via.placeholder.com/800x600?text=Kaos+Oversize+Detail+3'
            ],
            shopeeLink: 'https://shopee.co.id/kaos-oversize-loudwell-urban-explorer-i.987654321.123456789'
        },
        {
            id: 3,
            name: 'Topi Baseball "LOUDWELL Classic"',
            price: 'Rp 89.000',
            description: 'Topi baseball klasik dengan bordiran logo LOUDWELL. Tambahan sempurna untuk melengkapi gaya indie Anda.',
            availability: 'Tersedia',
            material: 'Katun Twill',
            sizes: 'All Size',
            image: 'https://via.placeholder.com/400x300?text=Topi+LOUDWELL',
            detailImages: [
                'https://via.placeholder.com/800x600?text=Topi+Detail+1',
                'https://via.placeholder.com/800x600?text=Topi+Detail+2'
            ],
            shopeeLink: 'https://shopee.co.id/topi-baseball-loudwell-classic-i.112233445.556677889'
        },
        {
            id: 4,
            name: 'Hoodie "Echoes of Freedom"',
            price: 'Rp 299.000',
            description: 'Hoodie tebal dengan desain "Echoes of Freedom" di bagian belakang. Hangat dan stylish untuk cuaca dingin.',
            availability: 'Tersedia',
            material: 'Fleece Katun',
            sizes: 'S, M, L, XL',
            image: 'https://via.placeholder.com/400x300?text=Hoodie+LOUDWELL',
            detailImages: [
                'https://via.placeholder.com/800x600?text=Hoodie+Detail+1',
                'https://via.placeholder.com/800x600?text=Hoodie+Detail+2'
            ],
            shopeeLink: 'https://shopee.co.id/hoodie-loudwell-echoes-of-freedom-i.334455667.778899001'
        },
        {
            id: 5,
            name: 'Celana Cargo "Street Wanderer"',
            price: 'Rp 279.000',
            description: 'Celana cargo dengan banyak saku, nyaman dan fungsional untuk petualangan urban Anda.',
            availability: 'Tersedia',
            material: 'Katun Ripstop',
            sizes: '28, 30, 32, 34, 36',
            image: 'https://via.placeholder.com/400x300?text=Celana+Cargo',
            detailImages: [
                'https://via.placeholder.com/800x600?text=Celana+Cargo+Detail+1',
                'https://via.placeholder.com/800x600?text=Celana+Cargo+Detail+2'
            ],
            shopeeLink: 'https://shopee.co.id/celana-cargo-loudwell-street-wanderer-i.556677889.990011223'
        }
    ];

    const productCardsContainer = document.getElementById('product-cards-container');
    const productDetailModal = new bootstrap.Modal(document.getElementById('productDetailModal'));

    // Fungsi untuk menampilkan kartu produk
    function displayProductCards() {
        products.forEach(product => {
            const cardCol = document.createElement('div');
            cardCol.className = 'col';
            cardCol.innerHTML = `
                <div class="card h-100 product-card" data-product-id="${product.id}">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-price">${product.price}</p>
                        <p class="card-text">${product.description.substring(0, 70)}...</p>
                        <button class="btn btn-primary btn-sm mt-2">Lihat Detail</button>
                    </div>
                </div>
            `;
            productCardsContainer.appendChild(cardCol);
        });

        // Tambahkan event listener untuk setiap kartu produk
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function() {
                const productId = parseInt(this.dataset.productId);
                const product = products.find(p => p.id === productId);
                if (product) {
                    showProductDetail(product);
                }
            });
        });
    }

    // Fungsi untuk menampilkan detail produk di modal
    function showProductDetail(product) {
        document.getElementById('modalProductName').innerText = product.name;
        document.getElementById('modalProductPrice').innerText = product.price;
        document.getElementById('modalProductDescription').innerText = product.description;
        document.getElementById('modalProductAvailability').innerText = product.availability;
        document.getElementById('modalProductMaterial').innerText = product.material;
        document.getElementById('modalProductSizes').innerText = product.sizes;
        document.getElementById('buyButton').href = product.shopeeLink;

        const productDetailImagesContainer = document.getElementById('productDetailImages');
        productDetailImagesContainer.innerHTML = ''; // Bersihkan gambar sebelumnya

        product.detailImages.forEach((imgSrc, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            carouselItem.innerHTML = `<img src="${imgSrc}" class="d-block w-100" alt="${product.name} Detail ${index + 1}">`;
            productDetailImagesContainer.appendChild(carouselItem);
        });

        productDetailModal.show();
    }

    // Panggil fungsi untuk menampilkan kartu produk saat DOM selesai dimuat
    displayProductCards();
});