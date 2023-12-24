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
    
    var body: some View {
        NavigationStack {
            List {
                ForEach(games) { game in
                    Text(game.name)
                }
                .onDelete(perform: deleteGame)
            }
            .toolbar {
                Button("Add game", systemImage: "plus", action: addGame)
            }
        }
    }
    
    func addGame() {
        let game = Game(name: "New game")
        modelContext.insert(game)
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
