import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Github, Minus, Plus } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const denominations = [
  { value: 100000, label: "Rp 100.000", image: "/rupiah/100.webp" },
  { value: 50000, label: "Rp 50.000", image: "/rupiah/50.webp" },
  { value: 20000, label: "Rp 20.000", image: "/rupiah/20.webp" },
  { value: 10000, label: "Rp 10.000", image: "/rupiah/10.webp" },
  { value: 5000, label: "Rp 5.000", image: "/rupiah/5.webp" },
  { value: 1000, label: "Rp 1.000", image: "/rupiah/1.webp" },
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [counts, setCounts] = useState(() => {
    return JSON.parse(localStorage.getItem("counts")) ||
      denominations.reduce((acc, denom) => ({ ...acc, [denom.value]: 0 }), {});
  });
  const [total, setTotal] = useState(() => {
    return JSON.parse(localStorage.getItem("grandTotal")) || 0;
  });

  useEffect(() => {
    setImages(denominations.map(d => d.image));
  }, []);
  

  useEffect(() => {
    localStorage.setItem("counts", JSON.stringify(counts));
    localStorage.setItem("grandTotal", JSON.stringify(total));
  }, [counts, total]);

  const updateCount = (value, increment) => {
    setCounts((prevCounts) => {
      const newCount = Math.max(0, prevCounts[value] + increment); // Hitung jumlah baru
      const updatedCounts = { ...prevCounts, [value]: newCount }; // Perbarui state counts
  
      // Hitung ulang total berdasarkan seluruh nominal yang ada
      const newTotal = Object.entries(updatedCounts).reduce(
        (acc, [key, count]) => acc + parseInt(key) * count,
        0
      );
  
      setTotal(newTotal); // Perbarui total
      return updatedCounts;
    });
  };
  

  const resetCounts = () => {
    setCounts(denominations.reduce((acc, denom) => ({ ...acc, [denom.value]: 0 }), {}));
    setTotal(0);
  };

  return (
    <div className="container max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-center mb-6 pt-6">Hitung Duit Lebaran</h1>
      <div className="flex flex-col text-center mt-4 mb-6 p-10 bg-[#FFDE2C] text-black rounded-xl">
        <p className="text-xs">Total</p>
        <h2 className="text-2xl font-bold pt-2">Rp {total.toLocaleString("id-ID")},00</h2>
        <Button variant='link' className='text-black cursor-pointer' onClick={resetCounts}>
          Reset
        </Button>
      </div>
      {denominations.map(({ value, label, image }) => (
        <div key={value} className="flex items-center justify-between space-x-4 py-2">
          <img src={image} alt={label} className="w-24 h-auto object-cover cursor-pointer" 
            onClick={() => {
              setPhotoIndex(0);
              setIsOpen(true);
            }}
          />
          <p className="font-semibold">{label}</p>
          <p className="text-center">x</p>
          <p className="font-semibold">{counts[value]}</p>
          <div className="flex gap-2">
            <Button
              variant='secondary'
              size='icon'
              onClick={() => updateCount(value, -1)}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              variant='secondary'
              size='icon'
              onClick={() => updateCount(value, 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
      <div className="flex gap-2 justify-between items-center">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-light">Original idea : <a href="https://kiraduitraya.com/" target="_blank" className="underline">kiraduitraya.com</a> by <a className="font-semibold underline" href="https://x.com/afrieirham_" target="_blank">Afrie Irham</a></p>
          <p className="text-xs font-light">Foto Duit : <a href="https://www.bi.go.id/id/rupiah/gambar-uang/default.aspx" target="_blank" className="underline">Bank Indonesia</a></p>
        </div>
        <div className="">
          <a href="https://github.com/unaivan22/hitungduitlebaran" target="_blank">
            <Button size='icon' variant='outline'><Github className="w-4 h-4" /></Button>
          </a>
        </div>
      </div>
      {/* Lightbox */}
      <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          index={photoIndex}
          slides={images.map((src) => ({ src }))}
          on={{ view: ({ index }) => setPhotoIndex(index) }}
        />
    </div>
  );
}
