"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlayerInfo() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
    dominant_hand: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (Object.values(form).some((v) => v === "")) {
      alert("Please fill all fields");
      return;
    }

    await fetch("http://localhost:8000/player-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/upload");
  };

  // preload data
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8000/player-info");
      const data = await response.json();
      setForm(data);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 shadow rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Enter Player Info</h1>
      <div className="grid gap-4">
        <input
          className="border p-2 rounded"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded"
          name="age"
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded"
          name="weight"
          placeholder="Weight (kg)"
          type="number"
          value={form.weight}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded"
          name="height"
          placeholder="Height (cm)"
          type="number"
          value={form.height}
          onChange={handleChange}
        />
        <select
          title="Gender"
          className="border p-2 rounded"
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          title="Dominant Hand"
          className="border p-2 rounded"
          name="dominant_hand"
          value={form.dominant_hand}
          onChange={handleChange}
        >
          <option value="">Dominant Hand</option>
          <option value="Left">Left</option>
          <option value="Right">Right</option>
        </select>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        Save & Continue
      </button>
    </div>
  );
}
