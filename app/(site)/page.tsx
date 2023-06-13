import Header from "@/components/Header";
import ListItem from "@/components/ListItem";

export default function Home() {
  return (
    <div className="
      rounded-lg 
      h-full 
      w-full
      bg-neutral-900 
      overflow-hidden 
      overflow-y-auto
    ">
      <Header>
        <div className="mb-2">
          <h1
            className="
              text-white
              text-3xl
              font-semibold
            "
          >
            Bem-vindo de volta!
          </h1>
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-3
              2xl:grid-cols-4
              gap-3
              mt-4
            "
          >
            <ListItem 
              image="/Images/liked.png"
              name="Músicas Curtidas"
              hrfe="liked"
            />
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            Músicas mais recentes
          </h1>
        </div>
        <div>
          Lista de músicas!
        </div>
      </div>
    </div>
  )
}
