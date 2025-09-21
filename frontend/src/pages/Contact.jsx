export default function Contact() {
  function handleSubmit(e) {
    e.preventDefault();
    alert("Message submitted (placeholder)");
  }

  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
      <p className="mt-2 text-gray-600">Send us a message using the form below.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:max-w-md">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            rows="4"
            placeholder="How can we help?"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </section>
  );
}


