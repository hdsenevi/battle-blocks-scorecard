//
//  GameDetailsView.swift
//  BattleBlocksScorecard
//
//  Created by Shanaka Senevirathne on 25/12/2023.
//

import SwiftUI
import SwiftData

struct GameDetailsView: View {
    @Environment(\.modelContext) var modelContext
    
    @Bindable var game: Game
    
//    @State private var path = [Round]()
    init(game: Game) {
        self.game = game
    }
    
    var body: some View {
        VStack {
            List {
                ForEach(game.rounds) { round in
                    Text("Round \(round.name)")
                }
                .onDelete(perform: deleteRound)
            }
            .navigationTitle($game.name)
            .navigationBarTitleDisplayMode(.inline)
            .navigationDestination(for: Round.self, destination: { round in
                Text(round.name)
            })
            .toolbar {
                Button("Add game", systemImage: "plus", action: addRound)
            }
            Button("Start Game") {
                // Start game action
            }
        }
    }
    
    func addRound() {
        withAnimation {
            let newRound = Round(name: "First round", roundNumber: game.rounds.count + 1, score: 0)
            game.rounds.append(newRound)
        }
    }
    
    func deleteRound(_ indexSet: IndexSet) {
        for index in indexSet {
            let roundToDelete = game.rounds[index]
//            modelContext.delete(roundToDelete)
        }
    }
}

//#Preview {
//    do {
//        let config = ModelConfiguration(isStoredInMemoryOnly: true)
//        let container = try ModelContainer(for: Game.self, configurations: config)
//        let example = Game(
//            name: "Sha's place",
//            startTime: .now
//        )
//        return GameDetailsView(game: example)
//            .modelContainer(container)
//    } catch {
//        fatalError("Failed to create model container.")
//    }
//}
