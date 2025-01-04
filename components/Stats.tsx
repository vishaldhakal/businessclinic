export function Stats() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold mb-2">500+</h3>
            <p>Issues Resolved</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-2">200+</h3>
            <p>Business Partners</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-2">98%</h3>
            <p>Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
