'use client';

/**
 * Manager Order History Page
 */
export default function ManagerOrderHistoryPage() {
  const orders = [
    {
      id: 'ORD-001',
      date: 'March 15, 2025',
      items: ['React Front To Back', 'PHP Beginner + Advanced'],
      total: '$88.00',
      status: 'Completed',
    },
  ];

  return (
    <>
      <div className="section-title">
        <h4 className="rbt-title-style-3">Order History</h4>
      </div>

      <div className="row g-5">
        {orders.map((order) => (
          <div key={order.id} className="col-lg-12">
            <div className="rbt-card variation-01 rbt-hover">
              <div className="rbt-card-body">
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <h5 className="rbt-card-title">Order #{order.id}</h5>
                    <ul className="rbt-meta">
                      <li><i className="feather-calendar"></i>{order.date}</li>
                      <li><i className="feather-check-circle"></i>{order.status}</li>
                    </ul>
                    <div className="mt--10">
                      <strong>Items:</strong>
                      <ul className="list-unstyled mt--5">
                        {order.items.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-4 text-end">
                    <div className="rbt-review">
                      <span className="rbt-title-style-2">Total: {order.total}</span>
                    </div>
                    <a className="rbt-btn btn-sm bg-primary-opacity mt--10" href="#">
                      View Invoice
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

