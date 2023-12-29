//
//  ContentView.swift
//  BattleBlocksScorecard
//
//  Created by Shanaka Senevirathne on 23/12/2023.
//

import SwiftUI
import SwiftData

struct ContentView: View {
    @Environment(\.modelContext) var modelContext
    
    @Query var games: [Game]
    @State private var path = [Game]()
    
    var body: some View {
        NavigationStack(path: $path) {
            List {
                ForEach(games) { game in
                    NavigationLink(value: game) {
                        Text(game.name)
                    }
                }
                .onDelete(perform: deleteGame)
            }
            .navigationTitle("Battle Blocks")
            .navigationDestination(for: Game.self, destination: GameDetailsView.init)
            .toolbar {
                Button("Add game", systemImage: "plus", action: addGame)
            }
        }
    }
    
    func addGame() {
        let game = Game(name: "New game")
        modelContext.insert(game)
        path = [game]
    }
    
    func deleteGame(_ indexSet: IndexSet) {
        for index in indexSet {
            let gameToDelete = games[index]
            modelContext.delete(gameToDelete)
        }
    }
}

#Preview {
    ContentView()
}
