'use client';

import Image from 'next/image';
import Link from 'next/link';

/**
 * Manager Wishlist Page
 */
export default function ManagerWishlistPage() {
  const wishlistItems = [
    {
      id: 1,
      title: 'React Front To Back',
      image: '/assets/images/course/course-online-01.jpg',
      price: '$49.00',
      rating: 5,
      reviews: 15,
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <i key={i} className={`fas fa-star ${i < rating ? '' : 'empty'}`}></i>
    ));
  };

  return (
    <>
      <div className="section-title">
        <h4 className="rbt-title-style-3">Wishlist</h4>
      </div>

      <div className="row g-5">
        {wishlistItems.map((item) => (
          <div key={item.id} className="col-lg-4 col-md-6 col-12">
            <div className="rbt-card variation-01 rbt-hover">
              <div className="rbt-card-img">
                <Link href="/courses/course-details">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={250}
                  />
                </Link>
              </div>
              <div className="rbt-card-body">
                <div className="rbt-card-top">
                  <div className="rbt-review">
                    <div className="rating">
                      {renderStars(item.rating)}
                    </div>
                    <span className="rating-count"> ({item.reviews} Reviews)</span>
                  </div>
                  <div className="rbt-bookmark-btn">
                    <a className="rbt-round-btn active" title="Bookmark" href="#">
                      <i className="feather-bookmark"></i>
                    </a>
                  </div>
                </div>
                <h4 className="rbt-card-title">
                  <Link href="/courses/course-details">{item.title}</Link>
                </h4>
                <div className="rbt-card-bottom">
                  <div className="rbt-price">
                    <span className="current-price">{item.price}</span>
                  </div>
                  <a className="rbt-btn btn-sm bg-primary-opacity" href="#">
                    Add to Cart
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

